import os from 'os';

import run from '../utils/run';

function connect(int, ssid, password) {
    switch (os.platform()) {
        case 'linux':
            return run('nmcli', ['device', 'wifi', 'connect', ssid, 'password', password, 'ifname', int]).then((out) => {
                console.log(out);
            });
        default:
            return Promise.reject();
    }
}

export default connect;
