import { AsyncStorage } from 'react-native';

class AuthUser {

    setId(id) {
        this.id = id;
        return this;
    }

    getId() {
        return this.id;
    }


    setName(name) {
        this.name = name;
        return this;
    }

    getName() {
        return this.name;
    }

    setEmail(email) {
        this.email = email;
        return this;
    }

    getEmail() {
        return this.email;
    }


    setAuthToken(authtoken) {
        this.authtoken = authtoken;
        return this;
    }

    getAuthToken() {
        return this.authtoken;
    }


    setImageurl(imageurl) {
        this.imageurl = imageurl;
        return this;
    }

    getImageurl() {
        return this.imageurl;
    }


    isAuthenticated() {
        return !!this.getAuthToken();
    }

    async save() {

        await AsyncStorage.setItem('authuser:id', this.id);
        await AsyncStorage.setItem('authuser:name', this.name);
        await AsyncStorage.setItem('authuser:email', this.email);
        await AsyncStorage.setItem('authuser:authtoken', this.authtoken);
        await AsyncStorage.setItem('authuser:imageurl', this.imageurl);

        return true;
    }


    async load() {
        this.id = await AsyncStorage.getItem('authuser:id');
        this.name = await AsyncStorage.getItem('authuser:name');
        this.email = await AsyncStorage.getItem('authuser:email');
        this.authtoken = await AsyncStorage.getItem('authuser:authtoken');
        this.imageurl = await AsyncStorage.getItem('authuser:imageurl');
    }

}


module.exports = new AuthUser();

