import os from 'os';

import parseItemsFromLines from '../utils/parseItemsFromLines';
import run from '../utils/run';

function listInterfaces() {
    switch (os.platform()) {
        case 'darwin':
            return run('networksetup', ['-listallhardwareports'])
                .then((out) =>
                    parseItemsFromLines(
                        out,
                        {
                            'Hardware Port': 'label',
                            Device: 'id',
                            'Ethernet Address': 'mac',
                        },
                        'Hardware Port',
                        ': ',
                    ),
                )
                .then((interfaces) => interfaces.filter(({ label }) => label.match(/^Wi-Fi/i)));
        case 'linux':
            return run('iw', ['dev']).then((out) =>
                parseItemsFromLines(
                    out,
                    {
                        Interface: 'id',
                        addr: 'mac',
                    },
                    'Interface',
                ),
            );
        default:
            return Promise.reject();
    }
}

export default listInterfaces;
