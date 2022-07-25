import os from 'os';
import Parser from 'table-parser';

import run from '../utils/run';

function listNetworks(int) {
    switch (os.platform()) {
        case 'linux':
            return run('nmcli', ['device', 'wifi', 'rescan', 'ifname', int]).catch((e) => {
                console.log(e);
            }).then(() =>
                run('nmcli', ['device', 'wifi', 'list', 'ifname', int]).then((out) => {
                    const items = Parser.parse(out);
                    return items.map(({ SSID, SECURITY }) => ({
                        ssid: SSID.join(' '),
                        security: SECURITY.join(' '),
                    }));
                }),
            );
        default:
            return Promise.reject(new Error('OS not supported'));
    }
}

export default listNetworks;
