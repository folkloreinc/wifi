
import listInterfaces from '../bin/listInterfaces';
import listNetworks from '../bin/listNetworks';
import connect from '../bin/connect';
import getNetwork from '../bin/getNetwork';

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

    network() {
        return getNetwork(this.interface);
    }

    connect(ssid, password) {
        return connect(this.interface, ssid, password);
    }

    disconnect() {

    }
}

export default Wifi;