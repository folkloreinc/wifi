import { Command } from 'commander';
import express from 'express';
import path from 'path';

import Wifi from '../lib/Wifi';

const command = new Command('server');

command.description('Run server').action(async () => {
    const staticPath = path.join(__dirname, '../../public');

    const app = express();
    const port = 5000;
    const int = 'wlp2s0';

    app.set('view engine', 'ejs');

    app.use((req, res, next) => {
        if (req.get('User-Agent') && req.get('User-Agent').search('CaptiveNetworkSupport') !== -1) {
            console.log('CAPTIVE');
            return res.end('NO SUCCESS');
        }
        return next();
    });

    app.use(express.static(staticPath));

    app.get('*', async (req, res) => {
        const wifi = new Wifi(int);
        const networks = await wifi.networks();
        return res.render(path.join(staticPath, 'index.html'), {
            networks,
        });
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});

export default command;
