import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, ListItem, Thumbnail, Text } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import customColor from '../../../native-base-theme/variables/customColor';
import Services from '../../Services';
import moment from "moment";

export default class Users extends Component {


    constructor(props) {
        super(props);
        this.state = { refreshing: false, friends: [], headerActivityIndicator: false };
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', payload => {
            this._getFriends();
        })
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


    // _gotoChatView = (item) => {
    //     this.props.navigation.navigate('Chat', { userid: item.id })
    // }

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
                <Text note>{lastMessage}</Text>
            </Body>
            <Right>
                {timeAgo ? <Text note>3:43 pm</Text> : null}

            </Right>
        </ListItem>)
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