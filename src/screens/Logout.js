import React from 'react';
import { StyleSheet, Image, Dimensions, ProgressBarAndroid, AsyncStorage } from 'react-native';
import { Container, Text } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import bgSrc from '../images/wallpaper.png';
import logo from '../images/logo.png';

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
                            style={{ width: '100%', height: 100, resizeMode: "contain", marginBottom: 30 }}
                        />

                        <ProgressBarAndroid styleAttr="Horizontal" color="#FFFFFF"
                            style={{ width: 250, height: 15 }}
                        />
                        <Text style={{ color: 'white', fontSize: 12 }}>{this.state.loadingText}</Text>

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
    }
});