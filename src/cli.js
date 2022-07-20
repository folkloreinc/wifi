import { program } from 'commander';

import interfacesCommand from './cli/interfaces';
import networksCommand from './cli/networks';
import serverCommand from './cli/server';

program
    .description('Handle wifi')
    .addCommand(interfacesCommand)
    .addCommand(networksCommand)
    .addCommand(serverCommand, {
        isDefault: true,
    });

program.parse();
