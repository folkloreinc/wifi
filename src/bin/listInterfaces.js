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
                        ':',
                    ),
                )
                .then((interfaces) => interfaces.filter(({ label }) => label.match(/^Wi-Fi/i)));
        case 'linux':
            return run('nmcli', ['device', 'show'])
                .then((out) =>
                    parseItemsFromLines(
                        out,
                        {
                            'GENERAL.DEVICE': 'id',
                            'GENERAL.HWADDR': 'mac',
                            'GENERAL.TYPE': 'type',
                            'GENERAL.CONNECTION': 'connection',
                            'GENERAL.STATE': 'state'
                        },
                        'GENERAL.DEVICE',
                        ':',
                    ),
                )
                .then((interfaces) =>
                    interfaces
                        .filter(({ type }) => type === 'wifi')
                        .map(({ connection, state, ...iface }) => ({
                            ...iface,
                            hotspot: (connection || '').toLowerCase() === 'hotspot',
                            connected: (state || '').split(' ')[0] === '100'
                        })),
                );
        default:
            return Promise.reject();
    }
}

export default listInterfaces;
