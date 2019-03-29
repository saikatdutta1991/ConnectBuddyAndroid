import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { WebView } from "react-native-webview";
import { Container, Header, Left, Body, Right, Button, Icon, Title, Spinner } from 'native-base';
import Endpoints from "../Endpoints";
import customColor from '../../native-base-theme/variables/customColor';
import { Col, Grid } from 'react-native-easy-grid';


export default class Aboutus extends Component {

    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    _onLoadEnd = () => {
        this.setState({ loading: false });
    }


    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>About Us</Title>
                    </Body>
                    <Right />
                </Header>

                <Grid>
                    <Col style={styles.container}>

                        <View style={{ overflow: 'hidden', flex: 1 }}>
                            <WebView source={{ uri: Endpoints.aboutus }}
                                onLoad={this._onLoadEnd}
                                style={{ width: Dimensions.get('window').width, flex: 1 }}
                            />
                            {this.state.loading && (<Spinner
                                color={customColor.brandPrimary}
                                style={{ position: "absolute", top: '45%', left: '45%' }}
                            />)}
                        </View>
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
        alignItems: 'center'
    },
});