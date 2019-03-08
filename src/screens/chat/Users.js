import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, ListItem, Thumbnail, Text } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';

let Data = require('./Data');

export default class Users extends Component {

    usersList = Data.getUsers();

    _keyExtractor = (item, index) => `${item.id}`;


    _gotoChatView = (item) => {
        this.props.navigation.navigate('Chat', { userid: item.id })
    }

    _renderItem = ({ item }) => (
        <ListItem avatar onPress={() => this._gotoChatView(item)}>
            <Left>
                <Thumbnail source={{ uri: item.imageUrl }} />
            </Left>
            <Body>
                <Text>{item.name}</Text>
                <Text note>{item.lastMessage}</Text>
            </Body>
            <Right>
                <Text note>3:43 pm</Text>
            </Right>
        </ListItem>
    );

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
                        <Title>Chat Users</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <FlatList
                        data={this.usersList}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </Content>
            </Container>
        );
    }

}