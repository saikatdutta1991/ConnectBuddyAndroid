import Endpoints from "./Endpoints";

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