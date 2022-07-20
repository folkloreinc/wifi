
import listInterfaces from '../bin/listInterfaces';
import listNetworks from '../bin/listNetworks';

class Wifi {
    constructor(int, opts) {
        this.interface = int;
    }

    static interfaces() {
        return listInterfaces();
    }

    networks() {
        return listNetworks(this.interface);
    }

    connected() {

    }

    connect(essid) {

    }

    disconnect() {

    }
}

export default Wifi;