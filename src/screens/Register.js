import React, { Component } from 'react';
import { StyleSheet, Image, Keyboard } from 'react-native';
import { Container, Button, Icon, Input, Item, Text, Left, Right, Toast, Spinner } from 'native-base';
import logo from '../images/logo.png';
import Services from '../Services';
import authuser from "../AuthUser";
import customColor from '../../native-base-theme/variables/customColor';

export default class Register extends Component {


    constructor(props) {
        super(props);
        this.state = {
            registerActivity: false,
            isPassVisible: false,
            name: '',
            email: '',
            password: ''
        }
    }

    _goForgetPassword = () => {
        alert('Forget password not implemented yet');
    }

    _goLogin = () => {
        this.props.navigation.navigate('Login')
    }

    _doRegister = async () => {

        Keyboard.dismiss(); // close keyboard

        /** call register api */
        this.setState({ registerActivity: true });

        let response = await Services.register(this.state.name, this.state.email, this.state.password);

        this.setState({ registerActivity: false });

        if (!response) { return false; }

        /** check if v_error */
        if (!response.success && response.type == 'v_error') {
            Toast.show({
                text: response.data[Object.keys(response.data)[0]],
                buttonText: 'Okay',
                type: "danger"
            })
            return;
        }

        if (response.success) {

            /** store auth user data */
            await authuser.setId(response.data.user._id)
                .setAuthToken(response.data.authToken)
                .setName(response.data.user.name)
                .setEmail(response.data.user.email)
                .setImageurl(response.data.user.image_url)
                .save();

            /** redirect to authloading */
            this.props.navigation.navigate('AuthLoading');

            return;
        }


    }


    render() {

        return (
            <Container style={styles.container}>

                <Image source={logo}
                    style={{ width: '100%', height: 100, resizeMode: "contain", marginBottom: 50 }}
                />

                <Item rounded style={styles.item}>
                    <Icon style={styles.itemIcon} active name='text-width' type='FontAwesome' />
                    <Input placeholderTextColor={customColor.brandPrimary} style={styles.itemInput} placeholder='Name' value={this.state.name} onChangeText={(text) => this.setState({ name: text })} />
                </Item>
                <Item rounded style={styles.item}>
                    <Icon style={styles.itemIcon} active name='envelope' type='FontAwesome' />
                    <Input placeholderTextColor={customColor.brandPrimary} style={styles.itemInput} placeholder='Email' value={this.state.email} onChangeText={(text) => this.setState({ email: text })} />
                </Item>
                <Item rounded style={styles.item}>
                    <Icon style={styles.itemIcon} active name='key' type='FontAwesome' />
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

                <Button rounded block style={[styles.item, styles.loginBtn]} onPress={this._doRegister}>
                    <Text>Register</Text>
                    {this.state.registerActivity ? <Spinner size="small" color='white' /> : null}

                </Button>

                <Item style={{ borderColor: 'transparent' }}>
                    <Left>
                        <Button transparent onPress={this._goLogin}>
                            <Text uppercase={false} style={styles.buttomButtonsText}>Account Login</Text>
                        </Button>
                    </Left>

                    <Right>
                        <Button transparent onPress={this._goForgetPassword}>
                            <Text uppercase={false} style={styles.buttomButtonsText}>Forget Password</Text>
                        </Button>
                    </Right>
                </Item>

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
        paddingLeft: 15
    },
    item: {
        marginBottom: 15,
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