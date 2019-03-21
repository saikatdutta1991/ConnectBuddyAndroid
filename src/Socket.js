import io from 'socket.io-client';
import Endpoints from "./Endpoints";

class Socket {

    _instance = null;

    instance(userid) {
        if (!this._instance) {
            this._instance = io(`${Endpoints.socket}${userid}`, {
                transports: ['websocket']
            });
        }

        return this._instance;
    }
}

module.exports = new Socket();