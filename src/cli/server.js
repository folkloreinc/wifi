import { Command } from 'commander';
import { renderFile } from 'ejs';
import express from 'express';
import path from 'path';

import Wifi from '../lib/Wifi';
import isOnline from '../utils/isOnline';

const command = new Command('server');

command.description('Run server').action(async () => {
    const webPath = path.join(__dirname, '../../web');

    const app = express();
    const port = 5000;

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
        console.log(network);
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
        console.log(network);
        return res.render(path.join(webPath, 'index.html.ejs'), {
            online,
            networks: networks.map(({ ssid, ...data }) => ({
                ...data,
                ssid,
                connected: ssid === network,
            })),
        });
    });

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});

export default command;
