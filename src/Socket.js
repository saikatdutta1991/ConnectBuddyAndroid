import io from 'socket.io-client';
import Endpoints from "./Endpoints";
import gStorage from "./GInmemStorage";
import Messaging from "./Messaging";
import NavigationService from './NavigationService';
import authuser from "./AuthUser";

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

        /** register incoming call */
        this._instance.on('incoming_call', data => {

            NavigationService.navigate('Call', {
                caller: {
                    _id: data.callerId,
                    name: data.callerName,
                    image_url: data.callerImageurl
                },
                callee: {
                    _id: authuser.getId(),
                    name: authuser.getName(),
                    image_url: authuser.getImageurl()
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