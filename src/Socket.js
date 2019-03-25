import io from 'socket.io-client';
import Endpoints from "./Endpoints";
import Services from "./Services";

class Socket {

    _instance = null;

    instance(userid) {
        if (!this._instance) {
            this._instance = io(`${Endpoints.socket}${userid}`); //{transports: ['websocket']}

            this.registerGlobalEvents();
        }

        return this._instance;
    }


    registerGlobalEvents() {

        this._instance.on('new_mesaage_received', message => {
            Services.playMessageReceivedSound();
        });
    }



    reset() {
        this._instance = null;
    }

}

module.exports = new Socket();