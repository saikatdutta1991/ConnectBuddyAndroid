import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Item, Icon, Title, Subtitle, Thumbnail, Content, ListItem, Text, Footer, Input } from 'native-base';

let Data = require('./Data');

export default class Chat extends Component {

    constructor(props) {
        super(props);
        let userid = this.props.navigation.getParam('userid', undefined)
        let user = Data.findUserById(userid);
        let currentUser = Data.getCurrentUser();
        this.state = { user: user, currentUser: currentUser }
    }

    _keyExtractor = (item, index) => `${item.id}`;

    _renderItem = ({ item }) => {

        if (this.state.currentUser.id == item.from) {

            return (
                <ListItem avatar noBorder style={{ marginRight: 5, marginLeft: 50, marginTop: 15 }}>
                    <Body style={{ padding: 15, backgroundColor: '#ff5722', borderRadius: 5, overflow: 'hidden', marginRight: 15, marginLeft: 0 }}>
                        <Text style={{ color: 'white' }}>{item.message}</Text>
                    </Body>
                    <Left>
                        <Thumbnail style={{ width: 30, height: 30 }} source={{ uri: this.state.currentUser.imageUrl }} />
                    </Left>
                </ListItem>
            );

        } else {

            let fromUser = Data.findUserById(item.from);

            return (
                <ListItem avatar noBorder style={{ marginLeft: 5, marginRight: 50, marginTop: 15 }}>
                    <Left>
                        <Thumbnail style={{ width: 30, height: 30 }} source={{ uri: fromUser.imageUrl }} />
                    </Left>
                    <Body style={{ padding: 15, backgroundColor: '#ffc107', borderRadius: 5, overflow: 'hidden' }}>
                        <Text style={{ color: 'white' }}>{item.message}</Text>
                    </Body>
                </ListItem>
            );
        }

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
                        <Thumbnail source={{ uri: this.state.user.imageUrl }} style={{ width: 40, height: 40 }} />
                    </Left>
                    <Body>
                        <Title>{this.state.user.name}</Title>
                        <Subtitle>Online</Subtitle>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name='search' />
                        </Button>
                        <Button transparent>
                            <Icon name='heart' />
                        </Button>
                        <Button transparent>
                            <Icon name='more' />
                        </Button>
                    </Right>
                </Header>

                <Content>
                    <FlatList
                        data={this.state.user.messages}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </Content>


                <Footer style={{ backgroundColor: 'transparent', marginBottom: 5, marginLeft: 5, marginRight: 5 }}>
                    <Body>
                        <Item rounded>
                            <Input placeholder='Type a message' style={{ paddingLeft: 15 }} />
                            <Button transparent>
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