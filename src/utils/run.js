import { exec } from 'child_process';

function run(command, args = null) {
    return new Promise((resolve, reject) => {
        exec(`${command}${args !== null ? ` ${args.join(' ')}` : ''}`, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

export default run;
