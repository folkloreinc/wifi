import { Command } from 'commander';
import createDebug from 'debug';
import { renderFile } from 'ejs';
import express from 'express';
import fs from 'fs-extra';
import { createServer } from 'http';
import isOnline from 'is-online';
// import IsOnlineEmitter from 'is-online-emitter';
import path from 'path';
import { Server } from 'socket.io';

import Wifi from '../lib/Wifi';

const debug = createDebug('wifi:server');
const command = new Command('server');

const localesPath =
    process.env.NODE_ENV === 'production'
        ? path.join(__dirname, './locale')
        : path.join(__dirname, '../../locale');
const webPath =
    process.env.NODE_ENV === 'production'
        ? path.join(__dirname, './web')
        : path.join(__dirname, '../../web');

command
    .description('Run server')
    .option('-c, --config <config>', 'Config file')
    .option('-p, --port <port>', 'Server port')
    .option('-l, --locale <locale>', 'interface locale')
    .option('-i, --iface <interface>', 'Interface to use')
    .option('--online-check-interval <interval>', 'Interval to check if online')
    .action(async () => {
        // Options
        const { config: configPath = null, ...options } = command.opts();
        const config = configPath !== null ? await fs.readJson(configPath) : null;
        const {
            port = process.env.PORT || 5000,
            iface = null,
            locale = process.env.UI_LOCALE || 'en',
            onlineCheckInterval = 10000,
        } = {
            ...config,
            ...options,
        };

        const translations = await fs.readJson(path.join(localesPath, `${locale}.json`));

        // Server
        const app = express();
        const httpServer = createServer(app);
        const io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
        app.set('view engine', 'html');
        app.engine('html', renderFile);
        app.use(express.json());
        app.use(
            express.urlencoded({
                extended: false,
            }),
        );

        // Get network interfaces
        const interfaces = await Wifi.interfaces();
        const networkInterface = interfaces.find(({ hotspot }) => !hotspot);
        const { id: networkInterfaceId = null } = networkInterface || {};
        const interfaceId = iface || networkInterfaceId;
        const wifi = new Wifi(interfaceId);

        // Status
        async function getStatus() {
            let networks = [];
            try {
                networks = await wifi.networks();
            } catch (e) {
                debug('Status error with networks: %s', e);
            }

            let online = false;
            try {
                online = await isOnline();
            } catch (e) {
                debug('Status error with online: %s', e);
            }

            let network = null;
            try {
                network = await wifi.network();
            } catch (e) {
                debug('Status error with network: %s', e);
            }
            return {
                online,
                networks: networks.map(({ ssid, ...data }) => ({
                    ...data,
                    ssid,
                    connected: ssid === network,
                })),
            };
        }
        let status = await getStatus();

        async function checkOnline() {
            debug('Checking online...');
            const { online: currentOnline = false } = status;
            let newOnline = false;
            try {
                newOnline = await isOnline();
            } catch (e) {
                debug('Status error with online: %s', e);
            }
            if (currentOnline !== newOnline) {
                debug('Online status changed: %s', newOnline ? 'true' : 'false');
                status = {
                    ...status,
                    online: newOnline,
                };
                io.emit('online', newOnline);
            } else {
                debug('Online status unchanged.');
            }
        }
        setInterval(checkOnline, onlineCheckInterval);

        async function updateStatus() {
            status = await getStatus();
            io.emit('status', status);
            return status;
        }

        debug('Interface %s', interfaceId);
        debug(`Status %O`, status);

        // Server
        io.on('connection', (socket) => {
            socket.emit('status', status);
        });

        app.use((req, res, next) => {
            if (
                req.get('User-Agent') &&
                req.get('User-Agent').search('CaptiveNetworkSupport') !== -1
            ) {
                debug('Receiving CaptiveNetworkSupport');
                return res.end('NO SUCCESS');
            }
            return next();
        });

        app.use(express.static(webPath));

        app.get('/status', (req, res) => res.json(status));
        app.post('/status', async (req, res) => {
            const newStatus = await updateStatus();
            return res.json(newStatus);
        });

        app.get('/networks', async (req, res) => {
            const { networks: currentNetworks } = status;
            return res.json(currentNetworks);
        });
        app.post('/networks', async (req, res) => {
            const { networks: newNetworks } = await updateStatus();
            return res.json(newNetworks);
        });

        app.post('/connect', async (req, res) => {
            const { ssid, password } = req.body;

            debug('Connect to %s...', ssid);

            try {
                await wifi.connect(ssid, password);
            } catch (e) {
                debug('Error while connecting: %s', e);
            }

            try {
                await updateStatus();
            } catch (e) {
                debug('Error while updating status: %s', e);
            }

            return res.json(status);
        });

        app.get('/', async (req, res) =>
            res.render(path.join(webPath, 'index.html.ejs'), {
                ...status,
                locale,
                translations,
                fromServer: true,
            }),
        );

        app.get('*', async (req, res) => {
            debug('Request to %s', req.pathname);

            return res.render(path.join(webPath, 'index.html.ejs'), {
                ...status,
                locale,
                translations,
                fromServer: true,
            });
        });

        httpServer.listen(port, () => {
            debug('Listening on port %i', port);
        });
    });

export default command;
