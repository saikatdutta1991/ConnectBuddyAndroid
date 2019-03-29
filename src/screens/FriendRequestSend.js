import React from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { Container, Text, Button, H1, H3, Thumbnail, Toast, Spinner } from 'native-base';
import Services from '../Services';
import gStorage from "../GInmemStorage";

export default class AuthLoading extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.props.navigation.getParam('user', 'null')
        };

        this.props.navigation.addListener('willFocus', payload => {
            this._getUserFromParam();
        })
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this._cancel();
        return true;
    }



    _getUserFromParam() {
        this.setState({
            user: this.props.navigation.getParam('user', 'null')
        });
    }


    _cancel = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.props.navigation.navigate(gStorage.previousRouteName);
    }

    /**
     * send friend request to the current user
     */
    _sendFriendRequest = async () => {

        this.setState({ requestSendIndicator: true });
        let response = await Services.sendFriendRequest(this.state.user._id);
        this.setState({ requestSendIndicator: false });

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }

        if (response == false) {
            Toast.show({
                text: 'Send request failed',
                buttonText: 'Okay',
                type: "danger"
            })
            return;
        }

        if (!response.success) {
            Toast.show({
                text: response.data.userid,
                buttonText: 'Okay',
                type: "danger"
            })
            return;
        }

        Toast.show({
            text: 'Friend request sent successfully',
            buttonText: 'Okay',
            type: "success"
        })

        setTimeout(() => {
            this._cancel();
        }, 500);

    }


    // Render any loading content that you like here
    render() {
        return (
            <Container style={styles.container}>

                <H1 style={{ fontWeight: 'bold', marginBottom: 50 }}>Add as Friend ?</H1>

                <Thumbnail large source={{ uri: this.state.user.image_url }}
                    style={{ width: 150, height: 150, marginBottom: 15, overflow: 'hidden', borderRadius: 100 }}
                />

                <H3>{this.state.user.name}</H3>

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 30

                }}>
                    <View style={{ flex: 1 }}>
                        <Button rounded warning block style={{ marginRight: 5 }} onPress={this._cancel}>
                            <Text>Go Back</Text>
                        </Button>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Button rounded success block style={{ marginLeft: 5 }} onPress={this._sendFriendRequest}>
                            <Text>Send Request</Text>
                            {this.state.requestSendIndicator ? <Spinner size="small" color='white' /> : null}
                        </Button>
                    </View>
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
        paddingLeft: 15
    }
});