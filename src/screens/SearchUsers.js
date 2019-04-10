import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Keyboard, FlatList } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text, Content, Item, Input, View, ListItem, Thumbnail } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import customColor from '../../native-base-theme/variables/customColor';
import Services from '../Services';
import gStorage from "../GInmemStorage";


export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSearching: false,
            keywords: '',
            users: []
        };
    }


    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this._onFocus);
    }


    _onFocus = () => {
        this._searchUsers();
    }


    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }


    /** call service for searching users */
    _searchUsers = async () => {

        Keyboard.dismiss();

        this.setState({ isSearching: true });
        let response = await Services.searchUsers(this.state.keywords);
        this.setState({ isSearching: false });

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }

        if (!response.success) {
            this.setState({ users: [] });
            return;
        }

        this.setState({ users: response.data });

    }


    _keyExtractor = (item, index) => item.id;

    _emptyListView = () => {
        if (!this.state.users.length) {
            return (
                <Text style={styles.emptyListView}>
                    <Icon name="times-circle" type='FontAwesome' style={{ color: customColor.brandPrimary, fontSize: 20 }} />
                    No users. Try to find again.
                </Text>
            );
        }

        return null;
    }


    _gotoRequestSend = (item) => {
        /** storage set current chat user */
        let user = {
            _id: item._id,
            name: item.name,
            image_url: item.image_url
        };

        gStorage.previousRouteName = 'SearchUsers';
        this.props.navigation.navigate('FriendRequestSend', { user: user })
    }


    _renderItem = ({ item }) => {

        return (
            <ListItem avatar onPress={() => this._gotoRequestSend(item)}>
                <Left>
                    <Thumbnail style={{ width: 50, height: 50 }} source={{ uri: item.image_url }} />
                </Left>
                <Body>
                    <Text numberOfLines={1}>{item.name}</Text>
                    <Text note numberOfLines={1}>{item.email}</Text>
                </Body>
            </ListItem >
        );
    };



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
                        <Title>Search</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={{ padding: 15, paddingTop: 0, backgroundColor: customColor.brandPrimary }}>
                    <Item rounded style={{ borderRadius: 5, backgroundColor: 'white' }}>
                        <Input onSubmitEditing={this._searchUsers} clearButtonMode="while-editing" autoCorrect={true} returnKeyType="search" placeholder="Type your keywords here.." placeholderTextColor="grey" value={this.state.keywords} onChangeText={(text) => this.setState({ keywords: text })} />
                        {
                            this.state.isSearching
                                ? <ActivityIndicator size="large" color={customColor.brandPrimary} style={{ marginRight: 10 }} />
                                : <Icon name="search" type='FontAwesome' onPress={this._searchUsers} style={{ color: "grey" }} />
                        }

                    </Item>
                </View>

                <Content>

                    <FlatList
                        ListEmptyComponent={this._emptyListView()}
                        data={this.state.users}
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