import React, { Component } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, ListItem, Thumbnail, Text, Toast, Content } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import customColor from '../../native-base-theme/variables/customColor';
import Services from '../Services';
import moment from "moment";
import authuser from "../AuthUser";
import Socket from "../Socket";
import { showMessage, hideMessage } from "react-native-flash-message";

export default class FriendRequests extends React.Component {

    socket;

    constructor(props) {
        super(props);
        this.state = { refreshing: false, friend_requests: [], headerActivityIndicator: false };
    }


    _onFriendRequestAcceptRejectReceived = () => {
        this._getFriendRequests();
    }



    async componentDidMount() {

        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this._onFocus);
        this.socket = await Socket.instance(authuser.getId());
        this.socket.on('new_friend_request', this._onFriendRequestAcceptRejectReceived);
        this.socket.on('friend_request_accepted', this._onFriendRequestAcceptRejectReceived);
        this.socket.on('friend_request_rejected', this._onFriendRequestAcceptRejectReceived);
    }


    componentWillUnmount() {
        this.willFocusSubscription.remove();
        this.socket.off('new_friend_request', this._onFriendRequestAcceptRejectReceived);
        this.socket.off('friend_request_accepted', this._onFriendRequestAcceptRejectReceived);
        this.socket.off('friend_request_rejected', this._onFriendRequestAcceptRejectReceived);
    }





    _onFocus = () => {
        this._getFriendRequests();
    }




    _onRefresh = () => {
        this._getFriendRequests();
    }

    _getFriendRequests = async () => {

        this.setState({ refreshing: true });

        /** get nearby users */
        let response = await Services.getFriendRequests();

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }

        if (!response.success) {
            this.setState({
                refreshing: false,
                friend_requests: []
            });
            return;
        }

        this.setState({ refreshing: false, friend_requests: response.data });

    }


    _keyExtractor = (item, index) => `${item.id}`;



    _cancelFriendRequest = async (userid) => {

        this.setState({ headerActivityIndicator: 'Cancelling..' });

        /** get nearby users */
        let response = await Services.cancelFriendRequest(userid);

        this.setState({ headerActivityIndicator: '' });

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }


        if (response == false) {
            showMessage({
                message: "Failed",
                description: "Failed to cancel request",
                type: "danger",
                floating: true
            });

            return;
        }

        if (!response.success) {
            showMessage({
                message: "Failed",
                description: response.data.userid,
                type: "danger",
                floating: true
            });

            return;
        }


        showMessage({
            message: "Success",
            description: 'Friend request canceled successfully',
            type: "success",
            floating: true
        });

        this._getFriendRequests();

    }

    _cancelFriendRequestConfirm = (userid) => {

        Alert.alert(
            'Confirmation',
            'Are you sure you want to cancel this friend request?',
            [
                {
                    text: 'NO',
                    style: 'cancel',
                },
                {
                    text: 'YES',
                    onPress: () => { this._cancelFriendRequest(userid) }
                },
            ],
            { cancelable: false },
        );

    }


    _rejectFriendRequest = async (userid) => {

        this.setState({ headerActivityIndicator: 'Rejecting..' });

        /** get nearby users */
        let response = await Services.rejectFriendRequest(userid);

        this.setState({ headerActivityIndicator: '' });

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }


        if (response == false) {
            showMessage({
                message: "Failed",
                description: 'Failed to reject friend request',
                type: "danger",
                floating: true
            });

            return;
        }

        if (!response.success) {
            showMessage({
                message: "Failed",
                description: response.data.userid,
                type: "danger",
                floating: true
            });

            return;
        }


        showMessage({
            message: "Success",
            description: 'Friend request rejected successfully',
            type: "success",
            floating: true
        });


        this._getFriendRequests();

    }

    _acceptFriendRequest = async (userid) => {

        this.setState({ headerActivityIndicator: 'Accepting..' });

        /** get nearby users */
        let response = await Services.acceptFriendRequest(userid);

        this.setState({ headerActivityIndicator: '' });

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }


        if (response == false) {

            showMessage({
                message: "Failed",
                description: 'Failed to accept friend request',
                type: "danger",
                floating: true
            });

            return;
        }

        if (!response.success) {

            showMessage({
                message: "Failed",
                description: response.data.userid,
                type: "danger",
                floating: true
            });

            return;
        }

        showMessage({
            message: "Success",
            description: 'Friend request accepted successfully',
            type: "success",
            floating: true
        });


        this._getFriendRequests();

    }


    _rejectFriendRequestConfirm = (userid) => {

        Alert.alert(
            'Confirmation',
            'Are you sure you want to reject this friend request?',
            [
                {
                    text: 'NO',
                    style: 'cancel',
                },
                {
                    text: 'YES',
                    onPress: () => { this._rejectFriendRequest(userid) }
                },
            ],
            { cancelable: false },
        );

    }

    _acceptFriendRequestConfirm = (userid) => {

        Alert.alert(
            'Confirmation',
            'Are you sure you want to accept this friend request?',
            [
                {
                    text: 'NO',
                    style: 'cancel',
                },
                {
                    text: 'YES',
                    onPress: () => { this._acceptFriendRequest(userid) }
                },
            ],
            { cancelable: false },
        );

    }



    _renderSendRequest = request => {

        //moment.utc(request.createdAt).format('dddd, MMM DD, YYYY') + ' ' + 
        let time = moment.utc(request.createdAt).fromNow();

        return (
            <ListItem avatar>
                <Left>
                    <Thumbnail style={{ width: 50, height: 50 }} source={{ uri: request.to_user.image_url }} />
                </Left>
                <Body>
                    <Text>{request.to_user.name}</Text>
                    <Text note >Sent . {time}</Text>
                </Body>
                <Right style={{}}>

                    <Button small danger onPress={() => { this._cancelFriendRequestConfirm(request.to_user._id) }}>
                        <Icon active name='trash' type='FontAwesome' />
                    </Button>


                </Right>
            </ListItem>
        );
    }


    _renderReceiveRequest = (request) => {

        let time = moment.utc(request.createdAt).fromNow();

        return (
            <ListItem avatar>
                <Left>
                    <Thumbnail style={{ width: 50, height: 50 }} source={{ uri: request.from_user.image_url }} />
                </Left>
                <Body>
                    <Text>{request.from_user.name}</Text>
                    <Text note>Received . {time}</Text>
                </Body>
                <Right>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Button small success style={{ marginRight: 5 }} onPress={() => { this._acceptFriendRequestConfirm(request.from_user._id) }}>
                            <Icon active name='check' type='FontAwesome' />
                        </Button>
                        <Button small danger onPress={() => { this._rejectFriendRequestConfirm(request.from_user._id) }}>
                            <Icon active name='trash' type='FontAwesome' />
                        </Button>
                    </View>

                </Right>
            </ListItem>
        );
    }



    _renderItem = ({ item }) => (
        (item.from_user._id == authuser.getId()) ? this._renderSendRequest(item) : this._renderReceiveRequest(item)
    )

    _emptyListView = () => {
        if (!this.state.friend_requests.length) {
            return (
                <Text style={styles.emptyListView}>No Requests. Pull to refresh.</Text>
            );
        }

        return null;
    }

    _headerActivityIndicator = () => {
        if (!this.state.headerActivityIndicator) {
            return null;
        }

        return (
            <React.Fragment>
                <Text style={{ color: 'white', marginRight: 5 }}>{this.state.headerActivityIndicator}</Text>
                <ActivityIndicator size="small" color='white' />
            </React.Fragment>
        );
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                            <Icon name='menu' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Friend Requests</Title>
                    </Body>
                    <Right>
                        {this._headerActivityIndicator()}
                    </Right>
                </Header>
                <Content>
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        ListEmptyComponent={this._emptyListView()}
                        data={this.state.friend_requests}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    emptyListView: {
        textAlign: 'center',
        marginTop: '50%',
        color: customColor.brandPrimary
    }
});