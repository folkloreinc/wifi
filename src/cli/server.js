import { Command } from 'commander';
import createDebug from 'debug';
import { renderFile } from 'ejs';
import express from 'express';
import { createServer } from 'http';
import isOnline from 'is-online';
// import IsOnlineEmitter from 'is-online-emitter';
import path from 'path';
import { Server } from 'socket.io';

import Wifi from '../lib/Wifi';

const debug = createDebug('wifi:server');
const command = new Command('server');

command
    .description('Run server')
    .option('-p, --port <port>', 'Server port', process.env.UI_PORT || 5000)
    .option('-l, --locale <locale>', 'interface locale', process.env.UI_LOCALE || 'en')
    .option('-i, --iface <interface>', 'Interface to use')
    .action(async () => {
        const webPath = path.join(__dirname, '../../web');

        const { port, iface = null, locale } = command.opts();

        // Server
        const app = express();
        const httpServer = createServer(app);
        const io = new Server(httpServer);

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

        async function updateStatus() {
            status = await getStatus();
            io.emit('status', status);
        }

        debug('Interface %s', interfaceId);
        debug(`Status %O`, status);

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

        app.get('/status', async (req, res) => res.json(status));

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
            }),
        );

        app.get('*', async (req, res) => {
            debug('Request to %s', req.pathname);
            return res.render(path.join(webPath, 'index.html.ejs'), {
                ...status,
                locale,
            });
        });

        httpServer.listen(port, () => {
            debug('Listening on port %i', port);
        });
    });

export default command;
