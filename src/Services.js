import Endpoints from "./Endpoints";
import authuser from "./AuthUser";
import Geolocation from 'react-native-geolocation-service';
import Sound from "react-native-sound";

this.messageReceivedSound = new Sound('whistle.mp3', Sound.MAIN_BUNDLE, error => { });
this.messageSentSound = new Sound('to_the_point.mp3', Sound.MAIN_BUNDLE, error => { });


module.exports.playMessageSentSound = () => {
    this.messageSentSound.setVolume(1).play();
}

module.exports.playMessageReceivedSound = () => {
    this.messageReceivedSound.setVolume(1).play();
}



/**
 * fetch messages
 */
module.exports.getMessages = async (userid) => {

    console.log('Service::getMessages()');

    let token = authuser.getAuthToken();
    let getmessagesurl = Endpoints.getMessages.replace(':userid', userid);

    return fetch(getmessagesurl, {
        method: 'GET',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        }
    }).then(response => {
        console.log('Service::getMessages(): response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::getMessages(): err', err);
        return false;
    })

}




/**
 * update user location
 */
module.exports.updateLocation = async (latitude, longitude) => {

    console.log('Service::updateLocation()');

    let token = authuser.getAuthToken();

    return fetch(Endpoints.updateProfile, {
        method: 'PATCH',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
        })
    }).then(response => {
        console.log('Service::updateLocation(): response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::updateLocation(): err', err);
        return false;
    })

}






module.exports.getFriends = async () => {

    console.log('Service::getFriends()');

    let token = authuser.getAuthToken();

    return fetch(Endpoints.getFriends, {
        method: 'GET',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        }
    }).then(response => {
        console.log('Service::getFriends(): response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::getFriends(): err', err);
        return false;
    })

}



module.exports.acceptFriendRequest = async (userid) => {

    console.log('Service::acceptFriendRequest()');

    let token = authuser.getAuthToken();

    return fetch(Endpoints.acceptFriendRequest, {
        method: 'POST',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userid: userid
        })
    }).then(response => {
        console.log('Service::acceptFriendRequest(): response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::acceptFriendRequest(): err', err);
        return false;
    })

}

module.exports.rejectFriendRequest = async (userid) => {

    console.log('Service::rejectFriendRequest()');

    let token = authuser.getAuthToken();

    return fetch(Endpoints.rejectFriendRequest, {
        method: 'POST',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userid: userid
        })
    }).then(response => {
        console.log('Service::rejectFriendRequest(): response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::rejectFriendRequest(): err', err);
        return false;
    })

}



module.exports.cancelFriendRequest = async (userid) => {

    console.log('Service::cancelFriendRequest()');

    let token = authuser.getAuthToken();

    return fetch(Endpoints.cancelFriendRequest, {
        method: 'POST',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userid: userid
        })
    }).then(response => {
        console.log('Service::cancelFriendRequest(): response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::cancelFriendRequest(): err', err);
        return false;
    })

}



module.exports.getFriendRequests = async () => {

    console.log('Service::getFriendRequests()');

    let token = authuser.getAuthToken();

    return fetch(Endpoints.getFriendRequests, {
        method: 'GET',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        }
    }).then(response => {
        console.log('Service::getFriendRequests(): response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::sendFriendRequest(): err', err);
        return false;
    })

}




module.exports.sendFriendRequest = async (userid) => {

    console.log('Service::sendFriendRequest()');

    let token = authuser.getAuthToken();

    return fetch(Endpoints.sendFriendRequest, {
        method: 'POST',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userid: userid
        })
    }).then(response => {
        console.log('Service::sendFriendRequest(): response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::sendFriendRequest(): err', err);
        return false;
    })


}



module.exports.getCurrentPosition = async () => {

    return new Promise(function (resolve, reject) {

        Geolocation.getCurrentPosition(
            (position) => {
                resolve(position);
            },
            (error) => {
                reject(error)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog: true, distanceFilter: 0 }
        );
    })
}


/**
 * get nearby users
 */
module.exports.getNearbyUsers = async (latitude, longitude, distance) => {

    console.log('Service::getNearbyUsers()');

    let token = authuser.getAuthToken();
    let endpoint = `${Endpoints.getNearbyUsers}?latitude=${latitude}&longitude=${longitude}&distance=${distance}`;

    return fetch(endpoint, {
        method: 'GET',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        }
    }).then(response => {
        console.log('Service::getNearbyUsers(): response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::getNearbyUsers(): err', err);
        return false;
    })

}




/**
 * update profile
 */
module.exports.updateProfile = async (name, email, newPassword) => {

    console.log('Service updateProfile');

    let token = authuser.getAuthToken();

    let data = {};
    data.name = name;
    data.email = email;
    if (newPassword) {
        data.new_password = newPassword;
    }

    return fetch(Endpoints.updateProfile, {
        method: 'PATCH',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => {
        console.log('uploadPhoto', response);
        return response.json();
    }).catch(err => {
        console.log('err', err);
        return false;
    })

}





/**
 * get profile
 */
module.exports.getProfile = async () => {

    console.log('Service::getProfile()');

    let token = authuser.getAuthToken();

    return fetch(Endpoints.getProfile, {
        method: 'GET',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log('Service::getProfile() -> response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::getProfile() -> err', err);
        return false;
    })

}



/** 
 * upload photo service
 */
module.exports.uploadPhoto = async (imagebase64) => {

    console.log('Service::uploadPhoto()');

    let token = authuser.getAuthToken();

    return fetch(Endpoints.updateProfile, {
        method: 'PATCH',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image_base64: imagebase64
        })
    }).then(response => {
        console.log('Service::uploadPhoto() -> response', response);
        return response.json();
    }).catch(err => {
        console.log('Service::uploadPhoto() -> err', err);
        return false;
    })

}


module.exports.login = async (email, password) => {

    console.log('calling login api')
    return fetch(Endpoints.login, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    }).then(response => {
        console.log('login', response);
        return response.json();
    }).catch(err => {
        console.log('err', err);
        alert('Unkonwn error : ' + err.message);
        return false;
    })

}




module.exports.register = async (name, email, password) => {

    console.log('calling register api')
    return fetch(Endpoints.register, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    }).then(response => {
        console.log('register', response);
        return response.json();
    }).catch(err => {
        console.log('err', err);
        alert('Unkonwn error : ' + err.message);
        return false;
    })

}