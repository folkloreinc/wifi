import { Command } from 'commander';
import { renderFile } from 'ejs';
import express from 'express';
import path from 'path';

import Wifi from '../lib/Wifi';

const command = new Command('server');

command.description('Run server').action(async () => {
    const staticPath = path.join(__dirname, '../../public');

    const app = express();
    const port = 5000;
    
    const interfaces = await Wifi.interfaces();
    const networkInterface = interfaces.find(({ hotspot }) => !hotspot);
    const { id: interfaceId } = networkInterface;
    const wifi = new Wifi(interfaceId);

    app.set('view engine', 'html');
    app.engine('html', renderFile);

    app.use(express.json());
    app.use(express.urlencoded());

    app.use((req, res, next) => {
        if (req.get('User-Agent') && req.get('User-Agent').search('CaptiveNetworkSupport') !== -1) {
            console.log('CAPTIVE');
            return res.end('NO SUCCESS');
        }
        return next();
    });

    app.use(express.static(staticPath));

    app.post('/connect', async (req, res) => {
        const { ssid, password } = req.body;
        console.log(`Connect on ${ssid}...`);
        await wifi.connect(ssid, password);
        return res.render(path.join(staticPath, 'success.html.ejs'), {
            
        });
    });

    app.get('*', async (req, res) => {
        const networks = await wifi.networks();
        return res.render(path.join(staticPath, 'index.html.ejs'), {
            networks,
        });
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});

export default command;
