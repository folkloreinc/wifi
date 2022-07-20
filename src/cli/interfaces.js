import { Command } from 'commander';

import Wifi from '../lib/Wifi';

const command = new Command('interfaces');

command.description('List interfaces').action(async () => {
    const interfaces = await Wifi.interfaces();
    console.log(JSON.stringify(interfaces));
});

export default command;
