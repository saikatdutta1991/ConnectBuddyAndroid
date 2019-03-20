import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, ListItem, Thumbnail, Text, Spinner } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import customColor from '../../native-base-theme/variables/customColor';
import Services from '../Services';

export default class FriendRequests extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loadingText: 'Loading ..' };
    }

    usersList = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
    ];


    _keyExtractor = (item, index) => `${item.id}`;

    _renderItem = ({ item }) => (
        <ListItem avatar>
            <Left>
                <Thumbnail style={{ width: 50, height: 50 }} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLKjeyA0x4bESIzB9GRujRldkqc37siZ7qM2xHL6rQmjVNqc24' }} />
            </Left>
            <Body>
                <Text>Saikat</Text>
                <Text note>Note</Text>
            </Body>
            <Right>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>

                    <Button small success style={{ marginRight: 5 }}>
                        <Text>Accept</Text>
                    </Button>
                    <Button small danger bordered>
                        <Text>Reject</Text>
                    </Button>
                </View>

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
                        <Title>Friend Requests</Title>
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

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     paddingRight: 15,
    //     paddingLeft: 15
    // }
});