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
                    return value.trim();
                })
                .then((connectionName) => run('nmcli', ['conn', 'show', `"${connectionName}"`]))
                .then((out) => {
                    const ssidLine = out
                        .split('\n')
                        .find((line) => line.match(/^802-11-wireless\.ssid/) !== null);
                    const [, value = null] = ssidLine.split(':', 2) || [];
                    return value !== null ? value.trim() : null;
                })
                .catch(() => null);
        default:
            return Promise.reject(new Error('OS not supported'));
    }
}

export default getNetwork;
