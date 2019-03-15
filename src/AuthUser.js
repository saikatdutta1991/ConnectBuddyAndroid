import { AsyncStorage } from 'react-native';

export default class AuthUser {

    static setId(id) {
        AsyncStorage.setItem('authuser:id', id);
    }

    static async getId() {
        return await AsyncStorage.getItem('authuser:id')
    }


    static setName(name) {
        AsyncStorage.setItem('authuser:name', name);
    }

    static async getName() {
        return await AsyncStorage.getItem('authuser:name')
    }

    static setEmail(email) {
        AsyncStorage.setItem('authuser:email', email);
    }

    static async getEmail() {
        return await AsyncStorage.getItem('authuser:email')
    }


    static setLatitude(latitude) {
        AsyncStorage.setItem('authuser:latitude', latitude);
    }

    static async getLatitude() {
        return await AsyncStorage.getItem('authuser:latitude')
    }

    static setLongitude(longitude) {
        AsyncStorage.setItem('authuser:longitude', longitude);
    }

    static async getLongitude() {
        return await AsyncStorage.getItem('authuser:longitude')
    }


    static setAuthToken(authtoken) {
        AsyncStorage.setItem('authuser:authtoken', authtoken);
    }

    static async getAuthToken() {
        return await AsyncStorage.getItem('authuser:authtoken')
    }


    static setImageurl(imageurl) {
        AsyncStorage.setItem('authuser:imageurl', imageurl);
    }

    static async getImageurl() {
        return await AsyncStorage.getItem('authuser:imageurl')
    }


    static async isAuthenticated() {
        let token = await this.getAuthToken();
        return token ? true : false;
    }



}