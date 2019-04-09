import React, { Component } from 'react';
import { StyleSheet, Image, Keyboard, View } from 'react-native';
import { Container, Button, Icon, Input, Item, Text, Left, Right, Spinner } from 'native-base';
import Services from '../Services';
import authuser from "../AuthUser";
import customColor from '../../native-base-theme/variables/customColor';
import { showMessage, hideMessage } from "react-native-flash-message";
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { google_oauth_web_client_id } from "../ApiKeys";


export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            registerActivity: false,
            isPassVisible: false,
            email: '',
            password: ''
        };
    }



    componentDidMount() {

        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/plus.profile.emails.read', 'https://www.googleapis.com/auth/plus.login'], // what API you want to access on behalf of the user, default is email and profile   
            forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
            webClientId: google_oauth_web_client_id
        });

    }




    _goForgetPassword = () => {
        alert('Forget password not implemented yet');
    }

    _goRegister = () => {
        this.props.navigation.navigate('Register')
    }

    _doLogin = async () => {

        Keyboard.dismiss(); // close keyboard

        /** call login api */
        this.setState({ registerActivity: true });

        let response = await Services.login(this.state.email, this.state.password);

        this.setState({ registerActivity: false });

        if (!response) { return false; }

        /** check if v_error */
        if (!response.success && response.type == 'v_error') {

            showMessage({
                message: "Login Failed",
                description: response.data[Object.keys(response.data)[0]],
                type: "danger",
                floating: true
            });

            return;
        }

        if (response.success) {

            /** store auth user data */
            await authuser.setId(response.data.user._id)
                .setAuthToken(response.data.authToken)
                .setName(response.data.user.name)
                .setEmail(response.data.user.email)
                .setImageurl(response.data.user.image_url)
                .setDeviceToken('')
                .save();

            /** redirect to authloading */
            this.props.navigation.navigate('AuthLoading');

            return;
        }
    }



    _doGoogleLogin = async () => {

        showMessage({
            message: "Google Auth",
            description: 'Google authentication is in progress',
            type: "info",
            floating: true,
            autoHide: false
        });


        try {
            await GoogleSignin.hasPlayServices();

            if (await GoogleSignin.isSignedIn()) {
                await GoogleSignin.signOut();
            }

            const userInfo = await GoogleSignin.signIn();

            let response = await Services.doGoogleAuth(userInfo.idToken);

            if (!response.success) {

                showMessage({
                    message: "Google Auth Failed",
                    description: response.message,
                    type: "danger",
                    floating: true
                });

                return;

            }


            /** store auth user data */
            await authuser.setId(response.data.user._id)
                .setAuthToken(response.data.authToken)
                .setName(response.data.user.name)
                .setEmail(response.data.user.email)
                .setImageurl(response.data.user.image_url)
                .setDeviceToken('')
                .save();


            showMessage({
                message: "Google Auth Success",
                description: 'You have been logged in successfully',
                type: "success",
                floating: true
            });


            /** redirect to authloading */
            this.props.navigation.navigate('AuthLoading');


        } catch (error) {

            showMessage({
                message: "Google Auth",
                description: error.message,
                type: "danger",
                floating: true
            });

        }


    }





    render() {

        return (
            <Container style={styles.container}>

                <Image source={Services.getLogo()}
                    style={{ width: '100%', height: 100, resizeMode: "contain", marginBottom: 50, borderRadius: 100 }}
                />


                <Item rounded style={styles.item}>
                    <Icon style={styles.itemIcon} active name='envelope' type='FontAwesome' />
                    <Input autoComplete="off" autoCapitalize='none' placeholderTextColor={customColor.brandPrimary} style={styles.itemInput} placeholder='Email' value={this.state.email} onChangeText={(text) => this.setState({ email: text })} />
                </Item>
                <Item rounded style={styles.item}>
                    <Icon style={styles.itemIcon} active name='lock' type='FontAwesome' />
                    <Input placeholderTextColor={customColor.brandPrimary} style={styles.itemInput} placeholder='Password' value={this.state.password} secureTextEntry={!this.state.isPassVisible} onChangeText={(text) => this.setState({ password: text })} />
                    {
                        this.state.isPassVisible ?
                            <Icon
                                style={styles.itemIcon}
                                active name='eye-slash'
                                type='FontAwesome'
                                onPress={() => { this.setState({ isPassVisible: false }) }} />
                            :
                            <Icon
                                style={styles.itemIcon}
                                active name='eye'
                                type='FontAwesome'
                                onPress={() => { this.setState({ isPassVisible: true }) }} />
                    }
                </Item>

                <Button rounded block style={[styles.item, styles.loginBtn]} onPress={this._doLogin}>
                    <Text>Login</Text>
                    {this.state.registerActivity ? <Spinner size="small" color='white' /> : null}
                </Button>

                <Item style={{ borderColor: 'transparent' }}>
                    <Left>
                        <Button transparent onPress={this._goRegister}>
                            <Text uppercase={false} style={styles.buttomButtonsText}>Create Account</Text>
                        </Button>
                    </Left>

                    <Right>
                        <Button transparent onPress={this._goForgetPassword}>
                            <Text uppercase={false} style={styles.buttomButtonsText}>Forget Password ?</Text>
                        </Button>
                    </Right>
                </Item>

                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 30 }}>OR</Text>
                <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'column', marginTop: 30 }}>

                    <GoogleSigninButton
                        style={{ width: '100%', height: 52 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Light}
                        onPress={this._doGoogleLogin}
                        disabled={this.state.isSigninInProgress} />

                </View>

            </Container>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor: customColor.brandLight
    },
    item: {
        marginBottom: 15,
        borderColor: customColor.brandPrimary
    },
    itemInput: {
        color: customColor.brandPrimary
    },
    itemIcon: {
        color: customColor.brandPrimary
    },
    buttomButtonsText: {
        color: customColor.brandPrimary,
        fontWeight: 'bold',
    },
    loginBtn: {
        marginTop: 30
    }

});