import { Command } from 'commander';
import { renderFile } from 'ejs';
import express from 'express';
import { createServer } from 'http';
import isOnline from 'is-online';
import IsOnlineEmitter from 'is-online-emitter';
import path from 'path';

import Wifi from '../lib/Wifi';

import { Server } from 'socket.io';

const command = new Command('server');

command.description('Run server').action(async () => {
    const webPath = path.join(__dirname, '../../web');

    const port = 5000;
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);

    const emitter = new IsOnlineEmitter({});
    // Listening to `connectivity.change` events.
    emitter.on('connectivity.change', console.log);

    const interfaces = await Wifi.interfaces();
    const networkInterface = interfaces.find(({ hotspot }) => !hotspot);
    const { id: interfaceId } = networkInterface;
    const wifi = new Wifi(interfaceId);

    console.log(`Interface ${interfaceId}`);

    app.set('view engine', 'html');
    app.engine('html', renderFile);

    app.use(express.json());
    app.use(express.urlencoded());

    app.use((req, res, next) => {
        if (req.get('User-Agent') && req.get('User-Agent').search('CaptiveNetworkSupport') !== -1) {
            console.log('Receiving CaptiveNetworkSupport');
            return res.end('NO SUCCESS');
        }
        return next();
    });

    app.use(express.static(webPath));

    app.get('/status', async (req, res) => {
        const networks = await wifi.networks();
        const online = await isOnline();
        return res.json({
            online,
            networks,
        });
    });

    app.post('/connect', async (req, res) => {
        const { ssid, password } = req.body;
        console.log(`Connect on ${ssid}...`);
        try {
            await wifi.connect(ssid, password);
        } catch (e) {}
        const networks = await wifi.networks();
        const online = await isOnline();
        const network = await wifi.network();
        return res.json({
            online,
            networks: networks.map(({ ssid: currentSsid, ...data }) => ({
                ...data,
                ssid: currentSsid,
                connected: currentSsid === network,
            })),
        });
    });

    app.get('/', async (req, res) => {
        const online = await isOnline();
        const networks = await wifi.networks();
        const network = await wifi.network();
        return res.render(path.join(webPath, 'index.html.ejs'), {
            online,
            networks: networks.map(({ ssid, ...data }) => ({
                ...data,
                ssid,
                connected: ssid === network,
            })),
        });
    });

    app.get('*', async (req, res) => {
        const online = await isOnline();
        const networks = await wifi.networks();
        const network = await wifi.network();
        return res.render(path.join(webPath, 'index.html.ejs'), {
            online,
            networks: networks.map(({ ssid, ...data }) => ({
                ...data,
                ssid,
                connected: ssid === network,
            })),
        });
    });

    httpServer.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});

export default command;
