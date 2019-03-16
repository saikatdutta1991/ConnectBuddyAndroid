import React, { Component } from 'react';
import { StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Container, Button, Icon, Input, Item, Text, Left, Right, Toast } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import bgSrc from '../images/wallpaper.png';
import logo from '../images/logo.png';
import Services from '../Services';
import authuser from "../AuthUser";

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


    _goForgetPassword = () => {
        alert('Forget password not implemented yet');
    }

    _goRegister = () => {
        this.props.navigation.navigate('Register')
    }

    _doLogin = async () => {

        /** call login api */
        this.setState({ registerActivity: true });

        let response = await Services.login(this.state.email, this.state.password);

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

            Toast.show({
                text: 'You have been loggedin successfully',
                buttonText: 'Okay',
                type: "success"
            })

            /** redirect to authloading */
            this.props.navigation.navigate('AuthLoading');

            return;
        }
    }


    render() {

        return (
            <Container>
                <Grid>
                    <Col style={styles.container}>

                        <Image style={{
                            width: Dimensions.get('window').width,
                            height: '100%',
                            resizeMode: 'cover',
                            position: 'absolute',
                        }} source={bgSrc} />


                        <Image source={logo}
                            style={{ width: '100%', height: 100, resizeMode: "contain", marginBottom: 100 }}
                        />


                        <Item rounded style={[styles.item, styles.itemInput]}>
                            <Icon active name='envelope' type='FontAwesome' />
                            <Input placeholder='Email' value={this.state.email} onChangeText={(text) => this.setState({ email: text })} />
                        </Item>
                        <Item rounded style={[styles.item, styles.itemInput]}>
                            <Icon active name='key' type='FontAwesome' />
                            <Input placeholder='Password' value={this.state.password} secureTextEntry={!this.state.isPassVisible} onChangeText={(text) => this.setState({ password: text })} />
                            {this.state.isPassVisible ?
                                <Icon active name='eye-slash' type='FontAwesome' onPress={() => { this.setState({ isPassVisible: false }) }} />
                                :
                                <Icon active name='eye' type='FontAwesome' onPress={() => { this.setState({ isPassVisible: true }) }} />
                            }
                        </Item>

                        <Button rounded dark block style={[styles.item, styles.loginBtn]} onPress={this._doLogin}>
                            <Text>Login</Text>
                            {this.state.registerActivity ? <ActivityIndicator size="small" color="#00ff00" /> : null}
                        </Button>

                        <Item style={{ borderColor: 'transparent' }}>
                            <Left>
                                <Button transparent onPress={this._goRegister}>
                                    <Text uppercase={false} style={styles.buttomButtonsText}>Create Account</Text>
                                </Button>
                            </Left>

                            <Right>
                                <Button transparent onPress={this._goForgetPassword}>
                                    <Text uppercase={false} style={styles.buttomButtonsText}>Forget Password</Text>
                                </Button>
                            </Right>
                        </Item>
                    </Col>
                </Grid>

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
        backgroundColor: 'white'
    },
    buttomButtonsText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loginBtn: {
        marginTop: 30
    }

});