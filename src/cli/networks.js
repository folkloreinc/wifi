import { Command } from 'commander';

import Wifi from '../lib/Wifi';

const command = new Command('networks');

command
    .description('List networks')
    .argument('<interface>', 'Wifi interface')
    .action(async (int) => {
        const wifi = new Wifi(int);
        const networks = await wifi.networks();
        console.log(JSON.stringify(networks));
    });

export default command;
