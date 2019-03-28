import firebase from 'react-native-firebase';
import CustomColor from "../native-base-theme/variables/customColor";
import Endpoints from "./Endpoints";

/** store current module instance */
var methods = {};


/** configure notification channel and create default channel */
methods.channel = new firebase.notifications.Android.Channel(
    'connectbuddy_messaging', 'Connectbuddy Messaging', firebase.notifications.Android.Importance.High
);
methods.channel.enableLights(true)
    .enableVibration(true)
    .setLockScreenVisibility(firebase.notifications.Android.Visibility.Public)
    .setSound('whistle.mp3')
    .setDescription('Connectbuddy Messaging');
firebase.notifications().android.createChannel(methods.channel);


/** handle foreground data only push messages */
methods.fgMessageHandler = async (message) => {
    console.log('_this', methods)
    console.log('this', methods)
    console.log('foreground message', message);
    methods.showNotification(message._data.type, message._messageId, message._sendTime, message._data);
}



/** handle background data only push messages */
methods.bgMessageHandler = async (message) => {

    console.log('background message', message);
    methods.showNotification(message.data.type, message.messageId, message.sendTime, message.data);
    return Promise.resolve();

}


/** show push notificaton based on type */
methods.showNotification = (type, id, time, data) => {

    let notification = new firebase.notifications.Notification()
        .setNotificationId(id)
        .setTitle(data.title)
        .setSubtitle(data.subtitle)
        .setBody(data.body)
        .setSound(methods.channel.sound)
        .android.setAutoCancel(true)
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setVisibility(firebase.notifications.Android.Visibility.Public)
        .android.setWhen(time)
        .android.setChannelId(methods.channel.channelId)
        .android.setColor(CustomColor.brandPrimary)
        .android.setSmallIcon('ic_launcher');


    switch (type) {

        /** show push notification when new friend request receives */
        case 'new_friend_request':
        case 'friend_request_rejected':
        case 'friend_request_accepteds':

            let extra = JSON.parse(data.extra);
            let url = Endpoints.getUserImage.replace(':userid', extra.from_user_id);
            notification
                .android.setBigText(data.body, data.title, data.subtitle)
                .android.setLargeIcon(url);

            break;


        default:
            break;

    }



    console.log('notification', notification);
    firebase.notifications().displayNotification(notification)

}

module.exports = methods;

//.android.setLargeIcon('https://connectbuddy.herokuapp.com/api/v1/user/5c8fdc9fdc7bfa0025436723/image')
//.android.setLargeIcon('ic_launcher')