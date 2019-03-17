import Endpoints from "./Endpoints";
import authuser from "./AuthUser";


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

    console.log('Service getProfile');

    let token = authuser.getAuthToken();

    return fetch(Endpoints.getProfile, {
        method: 'GET',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log('uploadPhoto', response);
        return response.json();
    }).catch(err => {
        console.log('err', err);
        return false;
    })

}



/** 
 * upload photo service
 */
module.exports.uploadPhoto = async (uri, type, name) => {

    console.log('Service uploadPhoto');

    let token = authuser.getAuthToken();
    let data = new FormData();
    data.append('image', {
        uri: uri,
        type: type,
        name: name,
    });

    return fetch(Endpoints.updateProfile, {
        method: 'PATCH',
        headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data'
        },
        body: data
    }).then(response => {
        console.log('uploadPhoto', response);
        return response.json();
    }).catch(err => {
        console.log('err', err);
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