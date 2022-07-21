import dns from 'dns';

function isOnline() {
    return new Promise((resolve, reject) => {
        dns.resolve('www.google.com', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export default isOnline;
