import React, { Component } from 'react';
import { FlatList, StyleSheet, View, Image } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Button, Item, Icon, Title, Subtitle, Thumbnail, ListItem, Text, Footer, Input } from 'native-base';
import gStorage from "../../GInmemStorage";
import authuser from "../../AuthUser";
import customColor from '../../../native-base-theme/variables/customColor';
import Services from '../../Services';
import Socket from "../../Socket";
import moment from "moment";


export default class Chat extends Component {

    socket;

    constructor(props) {

        super(props);

        /** initialize state */
        this.state = {
            currentChatUser: gStorage.currentChatUser,
            message: '',
            messages: [],
            refreshing: false,
            isFriendOnlie: gStorage.currentChatUser.is_online
        };

    }


    componentDidMount() {

        /** register on focus handler */
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this._onFocus);

        this.socket = Socket.instance(authuser.getId());
        this.socket.on('friend_online', this._onFriendOnline);
        this.socket.on('friend_offline', this._onFriendOffline);
        this.socket.on('new_mesaage_received', this._newMessageReceived);
        this.socket.on('new_message_sent', this._newMessageSent);
    }


    componentWillUnmount() {

        this.willFocusSubscription.remove();
        this.socket.off('friend_online', this._onFriendOnline);
        this.socket.off('friend_offline', this._onFriendOffline);
        this.socket.off('new_mesaage_received', this._newMessageReceived);
        this.socket.off('new_message_sent', this._newMessageSent);

    }



    _newMessageSent = message => {
        let messages = [...this.state.messages, message];
        this.setState({ messages: messages });
        Services.playMessageSentSound();
    }



    _newMessageReceived = message => {
        let messages = [...this.state.messages, message];
        this.setState({ messages: messages });
    }




    _onFriendOnline = (friendid) => {
        if (this.state.currentChatUser._id == friendid) {
            this.setState({ isFriendOnlie: true });
        }
    }

    _onFriendOffline = (friendid) => {
        if (this.state.currentChatUser._id == friendid) {
            this.setState({ isFriendOnlie: false });
        }
    }


    _onFocus = payload => {
        this._getMessages(this.state.currentChatUser._id);
    }

    _onRefresh = () => {
        this._getMessages(this.state.currentChatUser._id);
    }



    /** get messages for current user */
    _getMessages = async (userid) => {

        /** get messages */
        this.setState({ refreshing: true });
        let response = await Services.getMessages(userid);
        this.setState({ refreshing: false });

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }

        if (!response.success) {
            return this.setState({ messages: [] });
        }

        this.setState({ messages: response.data });

    }






    _keyExtractor = (item, index) => `${item.id}`;


    _renderAuthUserMessage = (message) => {

        let timeAgo = moment.utc(message.createdAt).fromNow();

        return (
            <View style={styles.authmessage_item}>
                <View style={styles.authmessage_body}>
                    <Text style={styles.authmessage_messageText}>{message.message}</Text>
                    <Text note style={styles.authmessage_note}>{timeAgo}</Text>
                </View>
                <View>
                    <Thumbnail style={styles.authmessage_thumbnail} source={{ uri: authuser.getImageurl() }} />
                </View>
            </View>
        );
    }


    _renderOtherUserMessage = (message) => {

        let timeAgo = moment.utc(message.createdAt).fromNow();

        return (
            <View avatar style={styles.othermessage_item}>
                <View style={styles.othermessage_thumbnail_container}>
                    <Thumbnail style={styles.othermessage_thumbnail} source={{ uri: this.state.currentChatUser.image_url }} />
                </View>
                <View style={styles.othermessage_body}>
                    <Text style={styles.othermessage_messageText}>{message.message}</Text>
                    <Text note style={styles.othermessage_note}>{timeAgo}</Text>
                </View>
            </View>
        );

    }


    _renderItem = ({ item }) => {

        /** auth user message item */
        if (item.from_user == authuser.getId()) {
            return this._renderAuthUserMessage(item);
        } else {
            return this._renderOtherUserMessage(item);
        }
    }


    /** send message to socket */
    _sendBtnPressed = () => {

        if (!this.state.message) {
            return;
        }

        this.socket.emit('send_new_message', {
            message: this.state.message,
            to_user: this.state.currentChatUser._id,
        })

        this.setState({ message: '' });

    }

    _handleMessageInputChange = (message) => {
        this.setState({ message: message })
    }



    _emptyListView = () => {
        if (!this.state.messages.length) {
            return (
                <Text style={styles.emptyListView}>Say hi to your new friend.</Text>
            );
        }
        return null;
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
                    <Left style={{ marginLeft: -15 }}>
                        <Thumbnail source={{ uri: this.state.currentChatUser.image_url }} style={{ width: 40, height: 40 }} />
                    </Left>
                    <Body>
                        <Title>{this.state.currentChatUser.name}</Title>
                        <Subtitle>{this.state.isFriendOnlie ? 'online' : 'offline'}</Subtitle>
                    </Body>
                    <Right />
                </Header>

                <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    ListEmptyComponent={this._emptyListView()}
                    data={this.state.messages}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ref={ref => this.flatList = ref}
                    onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}

                />



                <Footer style={{ backgroundColor: 'transparent', marginBottom: 5, marginLeft: 5, marginRight: 5 }}>
                    <Body>
                        <Item rounded>
                            <Input placeholder='Type a message' style={{ paddingLeft: 15 }}
                                onChangeText={this._handleMessageInputChange}
                                value={this.state.message}
                            />
                            <Button transparent onPress={this._sendBtnPressed}>
                                <Icon
                                    active
                                    name='paper-plane'
                                    style={{ color: "#ff5722", fontSize: 26, width: 30 }}
                                    type='FontAwesome'
                                />
                            </Button>
                        </Item>
                    </Body>
                </Footer>


            </Container >
        );
    }

}


const styles = StyleSheet.create({
    emptyListView: {
        textAlign: 'center',
        marginTop: '50%',
        color: customColor.brandPrimary
    },
    othermessage_item: { marginTop: 15, flex: 1, flexDirection: 'row', marginLeft: 15, marginRight: 15 },
    othermessage_thumbnail_container: {},
    othermessage_thumbnail: { width: 30, height: 30, top: 0 },
    othermessage_body: { marginLeft: 5, marginRight: 50 },
    othermessage_messageText: { color: 'white', backgroundColor: '#ffc107', padding: 5, borderRadius: 5 },
    othermessage_note: {},

    authmessage_item: { marginTop: 15, flex: 1, flexDirection: 'row', marginLeft: 15, marginRight: 15, justifyContent: 'flex-end' },
    authmessage_thumbnail_container: {},
    authmessage_thumbnail: { width: 30, height: 30 },
    authmessage_body: { marginLeft: 50, marginRight: 5 },
    authmessage_messageText: { color: 'white', backgroundColor: '#ff5722', padding: 5, borderRadius: 5 },
    authmessage_note: {}
});