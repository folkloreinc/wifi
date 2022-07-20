import os from 'os';

import parseItemsFromLines from '../utils/parseItemsFromLines';
import run from '../utils/run';

function listNetworks(int) {
    switch (os.platform()) {
        case 'darwin':
            return run('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport', ['-s'])
                .then((out) => {
                    const table = out.split('\n').map(it => it.trim());
                    const [columns, ...rows] = table;
                    console.log(columns.split('\t'));
                });
        case 'linux':
            return run('iw', ['dev']).then((out) => {
                
            });
        default:
            return Promise.reject();
    }
}

export default listNetworks;
