import { Command } from 'commander';
import express from 'express';

const command = new Command('server');

command.description('Run server').action(async () => {
    const app = express();
    const port = 5000;

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});

export default command;
