import os from 'os';
import Parser from 'table-parser';

import run from '../utils/run';

function listNetworks(int) {
    switch (os.platform()) {
        case 'darwin':
            return run(
                '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport',
                ['-s'],
            ).then((out) => {
                const table = out.split('\n').map((it) => it.trim());
                const [columns, ...rows] = table;
                console.log(columns.split('\t'));
            });
        case 'linux':
            return run('nmcli', ['device', 'wifi', 'rescan', 'ifname', int]).then(() =>
                run('nmcli', ['device', 'wifi', 'list', 'ifname', int]).then((out) => {
                    const items = Parser.parse(out);
                    return items.map(({ SSID, SECURITY }) => ({
                        ssid: SSID.join(' '),
                        security: SECURITY.join(' '),
                    }));
                }),
            );
        default:
            return Promise.reject();
    }
}

export default listNetworks;
