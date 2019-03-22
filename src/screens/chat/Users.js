import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, ListItem, Thumbnail, Text } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import customColor from '../../../native-base-theme/variables/customColor';
import Services from '../../Services';
import moment from "moment";
import gStorage from "../../GInmemStorage";
import Socket from "../../Socket";
import authuser from "../../AuthUser";

export default class Users extends Component {

    socket;

    constructor(props) {
        super(props);
        this.state = { refreshing: false, friends: [], headerActivityIndicator: false };
    }

    componentDidMount() {

        /** register on focus handler */
        this.props.navigation.addListener('willFocus', this._onFocus);

        this.socket = Socket.instance(authuser.getId());
        this.socket.on('friend_online', this._onFriendOnline);
        this.socket.on('friend_offline', this._onFriendOffline);
        this.socket.on('new_mesaage_received', this._newMessageReceived);
    }


    _newMessageReceived = message => {

        let index = this.state.friends.findIndex(friend => {
            return friend._id == message.from_user;
        });

        if (index == -1) {
            return;
        }

        let newFriendsArr = [...this.state.friends];
        let oldFriendObject = newFriendsArr[index];
        oldFriendObject.last_message = message;
        newFriendsArr[index] = oldFriendObject;

        this.setState({ friends: newFriendsArr });
    }



    _onFriendOnline = (friendid) => {

        let index = this.state.friends.findIndex(friend => {
            return friend._id == friendid;
        });

        if (index == -1) {
            return;
        }

        let newFriendsArr = [...this.state.friends];
        let oldFriendObject = newFriendsArr[index];
        oldFriendObject.is_online = true;
        newFriendsArr[index] = oldFriendObject;

        this.setState({ friends: newFriendsArr });
    }

    _onFriendOffline = (friendid) => {
        let index = this.state.friends.findIndex(friend => {
            return friend._id == friendid;
        });

        if (index == -1) {
            return;
        }

        let newFriendsArr = [...this.state.friends];
        let oldFriendObject = newFriendsArr[index];
        oldFriendObject.is_online = false;
        newFriendsArr[index] = oldFriendObject;

        this.setState({ friends: newFriendsArr });
    }



    _onFocus = payload => {
        this._getFriends();
    }

    _onRefresh = () => {
        this._getFriends();
    }


    _getFriends = async () => {

        this.setState({ refreshing: true });

        /** get nearby users */
        let response = await Services.getFriends();

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }

        if (!response.success) {
            this.setState({
                refreshing: false,
                friends: []
            });
            return;
        }

        this.setState({ refreshing: false, friends: response.data.friends });

    }





    _keyExtractor = (item, index) => `${item.id}`;


    _gotoChatView = (item) => {
        /** storage set current chat user */
        gStorage.currentChatUser = item;
        this.props.navigation.navigate('Chat')
    }

    _renderItem = ({ item }) => {

        let lastMessage;
        let timeAgo = '';
        if (item.last_message) {
            timeAgo = moment.utc(item.last_message.createdAt).fromNow();
            lastMessage = `${item.last_message.message}`;
        } else {
            lastMessage = 'Say hi to your new friend';
        }

        return (<ListItem avatar onPress={() => this._gotoChatView(item)}>
            <Left>
                <Thumbnail style={{ width: 50, height: 50 }} source={{ uri: item.image_url }} />
            </Left>
            <Body>
                <Text>
                    {item.name}
                </Text>
                <Text note numberOfLines={1}>{lastMessage}</Text>
                {timeAgo ? <Text note style={{ fontSize: 10 }}>{timeAgo}</Text> : null}
            </Body>
            <Right>
                <Icon name="circle" type='FontAwesome' style={{ color: item.is_online ? 'green' : 'grey', fontSize: 15 }} />
            </Right>
        </ListItem >)
    };


    _emptyListView = () => {
        if (!this.state.friends.length) {
            return (
                <Text style={styles.emptyListView}>No Friends. Pull to refresh.</Text>
            );
        }

        return null;
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
                        <Title>Friends</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        ListEmptyComponent={this._emptyListView()}
                        data={this.state.friends}
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