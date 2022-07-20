import { Command } from 'commander';
import express from 'express';

const command = new Command('server');

command.description('Run server').action(async () => {
    const app = express();
    const port = 5000;

    app.use((req, res, next) => {
        if (req.get('User-Agent') && req.get('User-Agent').search('CaptiveNetworkSupport') !== -1) {
            console.log('CAPTIVE');
            return res.end('NO SUCCESS');
        }
        return next();
    });

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});

export default command;
