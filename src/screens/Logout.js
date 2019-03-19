import React from 'react';
import { StyleSheet, Image, ProgressBarAndroid, AsyncStorage } from 'react-native';
import { Container, Text } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import logo from '../images/logo.png';
import customColor from '../../native-base-theme/variables/customColor';

export default class AuthLoading extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loadingText: 'Loading ..' };
    }


    async componentDidMount() {
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