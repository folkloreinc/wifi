
import listInterfaces from '../bin/listInterfaces';
import listNetworks from '../bin/listNetworks';
import connect from '../bin/connect';

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

    connect(ssid, password) {
        return connect(this.interface, ssid, password);
    }

    disconnect() {

    }
}

export default Wifi;