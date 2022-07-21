import os from 'os';

import run from '../utils/run';

function getNetwork(int) {
    switch (os.platform()) {
        case 'linux':
            return run('nmcli', ['device', 'show', int])
                .then((out) => {
                    const connectionLine = out
                        .split('\n')
                        .find((line) => line.match(/^GENERAL\.CONNECTION/) !== null);
                    const [, value = null] = connectionLine.split(':', 2) || [];
                    if (value === null || value.trim().length === 0) {
                        throw new Error('No connection');
                    }
                    console.log(value);
                    return value.trim();
                })
                .then((connectionName) => {
                    console.log('nmcli', ['conn', 'show', `"${connectionName}"`]);
                    return run('nmcli', ['conn', 'show', `"${connectionName}"`]);
                })
                .then((out) => {
                    const ssidLine = out
                        .split('\n')
                        .find((line) => line.match(/^802-11-wireless\.ssid/) !== null);
                        console.log(ssidLine);
                    const [, value = null] = ssidLine.split(':', 2) || [];
                    return value !== null ? value.trim() : null;
                })
                .catch(() => null);
        default:
            return Promise.reject();
    }
}

export default getNetwork;
