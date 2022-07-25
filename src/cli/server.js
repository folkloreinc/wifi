import { Command } from 'commander';
import { renderFile } from 'ejs';
import express from 'express';
import { createServer } from 'http';
import isOnline from 'is-online';
import IsOnlineEmitter from 'is-online-emitter';
import path from 'path';
import { Server } from 'socket.io';

import Wifi from '../lib/Wifi';

const command = new Command('server');

command
    .description('Run server')
    .option('-p, --port <port>', 'Server port', process.env.PORT || 5000)
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
            const networks = await wifi.networks();
            const online = await isOnline();
            const network = await wifi.network();
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

        // Check connectivity change
        const emitter = new IsOnlineEmitter({});
        emitter.on('connectivity.change', ({ status: newOnline }) => {
            console.log('Connectivity change', newOnline);
            if (newOnline !== status.online) {
                status = {
                    ...status,
                    online: newOnline,
                };
            }
        });
        emitter.on('network.interface.change', (e) => {
            console.log(e);
        });

        console.log(`Interface ${interfaceId}`);

        app.use((req, res, next) => {
            if (
                req.get('User-Agent') &&
                req.get('User-Agent').search('CaptiveNetworkSupport') !== -1
            ) {
                console.log('Receiving CaptiveNetworkSupport');
                return res.end('NO SUCCESS');
            }
            return next();
        });

        app.use(express.static(webPath));

        app.get('/status', async (req, res) => res.json(status));

        app.post('/connect', async (req, res) => {
            const { ssid, password } = req.body;
            console.log(`Connect on ${ssid}...`);
            try {
                await wifi.connect(ssid, password);
                updateStatus();
                // eslint-disable-next-line no-empty
            } catch (e) {}
            return res.json(status);
        });

        app.get('/', async (req, res) =>
            res.render(path.join(webPath, 'index.html.ejs'), {
                ...status,
                locale,
            }),
        );

        app.get('*', async (req, res) =>
            res.render(path.join(webPath, 'index.html.ejs'), {
                ...status,
                locale,
            }),
        );

        httpServer.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    });

export default command;
