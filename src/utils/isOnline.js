import dns from 'dns';

function isOnline() {
    return new Promise((resolve) => {
        dns.resolve('www.google.com', (err) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

export default isOnline;
