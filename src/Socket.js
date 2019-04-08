import io from 'socket.io-client';
import Endpoints from "./Endpoints";
import gStorage from "./GInmemStorage";
import Messaging from "./Messaging";
import NavigationService from './NavigationService';
import authuser from "./AuthUser";
import { YellowBox } from 'react-native';

console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);



var previousVideoCallid;

class Socket {

    _instance = null;

    instance(userid) {
        if (!this._instance) {
            this._instance = io(`${Endpoints.socket}${userid}`, { transports: ['websocket'] });

            this.registerGlobalEvents();
        }

        return this._instance;
    }


    registerGlobalEvents() {

        /** register incoming call */
        this._instance.on('incoming_call', data => {

            console.log('incoming_call', data);

            /** if previous call id is same as current callid then no need to render view again*/
            if (previousVideoCallid == data.callid) {
                return;
            }

            /** change previous callid with new id */
            previousVideoCallid = data.callid;

            NavigationService.navigate('Call', {
                caller: {
                    _id: data.callerId,
                    name: data.callerName,
                    image_url: data.callerImageurl,
                    is_online: true
                },
                callee: {
                    _id: authuser.getId(),
                    name: authuser.getName(),
                    image_url: authuser.getImageurl(),
                    is_online: true
                },
                view_type: 'RECEIVE_CALL',
                is_caller: false
            });


        });




        /** show push notification if not the from_user chat screen opened */
        this._instance.on('new_mesaage_received', message => {

            console.log('new message socket', message);

            if (gStorage.currentChatUser && gStorage.currentChatUser._id == message.from_user) {
                return;
            }

            //show push notification
            Messaging.showNotification('new_mesaage_received', message._id, new Date(), {
                title: message.from_user_name,
                subtitle: 'New message',
                body: message.message,
                extra: JSON.stringify({ from_user: message.from_user })
            });


        });

    }



    reset() {
        this._instance = null;
    }

}

module.exports = new Socket();