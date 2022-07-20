import { program } from 'commander';

import interfacesCommand from './cli/interfaces';
import networksCommand from './cli/networks';

program.description('Handle wifi').addCommand(interfacesCommand).addCommand(networksCommand);

program.parse();
