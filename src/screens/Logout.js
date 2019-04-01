import React from 'react';
import { StyleSheet, Image, ProgressBarAndroid, AsyncStorage } from 'react-native';
import { Container, Text } from 'native-base';
import logo from '../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png';
import customColor from '../../native-base-theme/variables/customColor';
import Socket from "../Socket";
import authuser from "../AuthUser";;
import BackgroundTimer from 'react-native-background-timer';
import gStorage from "../GInmemStorage";

export default class AuthLoading extends React.Component {

    socket;

    constructor(props) {
        super(props);
        this.state = { loadingText: 'Loading ..' };
    }


    async componentDidMount() {

        this.setState({ loadingText: 'Removing update locaiton ..' });
        BackgroundTimer.clearInterval(gStorage.updateLocationTimer);

        this.socket = await Socket.instance(authuser.getId());
        this.setState({ loadingText: 'Disconnecting socket ..' });
        this.socket.disconnect();
        Socket.reset();

        this.setState({ loadingText: 'Logging you out ..' });
        AsyncStorage.clear();
        setTimeout(() => { this.props.navigation.navigate('Auth'); }, 1000)
    }


    // Render any loading content that you like here
    render() {
        return (
            <Container style={styles.container}>

                <Image source={logo}
                    style={{ width: '100%', height: 100, resizeMode: "contain", marginBottom: 50 }}
                />

                <ProgressBarAndroid styleAttr="Horizontal" color={customColor.brandPrimary}
                    style={{ width: 250, height: 15 }}
                />
                <Text style={{ color: customColor.brandPrimary, fontSize: 12 }}>{this.state.loadingText}</Text>
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
    }
});