import React, { Component } from 'react';
import { StyleSheet, Platform, FlatList } from 'react-native';
import { Content, Text, ListItem, Icon, Container, Left, Body, Right, Thumbnail, Button } from "native-base";
import authuser from "../AuthUser";
import gStorage from "../GInmemStorage";


const datas = [
    {
        name: "Home",
        route: "Home",
        icon: "home"
    },
    {
        name: "Chat",
        route: "ChatUsers",
        icon: "comments",
    },
    {
        name: "Profile",
        route: "Profile",
        icon: "user",
    },
    {
        name: "Logout",
        route: "Logout",
        icon: "power-off",
    },

];

export default class SideBar extends Component {


    constructor(props) {
        super(props);
        this.state = {
            authuser_image: authuser.getImageurl(),
            authuser_name: authuser.getName()
        };
    }


    componentDidMount() {

        /** store main manu state to global storage for change from another component */
        gStorage.mainMenu = this;
    }



    _keyExtractor = (item, index) => item.name;

    _renderItem = ({ item }) => (
        <ListItem
            button

            onPress={() => this.props.navigation.navigate(item.route)}
        >
            <Left>
                <Icon
                    active
                    name={item.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                    type='FontAwesome'
                />
                <Text style={styles.text}>
                    {item.name}
                </Text>
            </Left>
        </ListItem>
    );

    render() {
        return (
            <Container>
                <Content
                    bounces={false}
                    style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
                >

                    <ListItem thumbnail noBorder style={styles.listHeader}>
                        <Left>
                            <Thumbnail source={{ uri: this.state.authuser_image }} />
                        </Left>
                        <Body>
                            <Text style={styles.headerTextName}>{this.state.authuser_name}</Text>
                            <Text note style={styles.headerTextNote}>V2.0</Text>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Icon active name='cog' type='FontAwesome' style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </ListItem>


                    <FlatList
                        data={datas}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </Content>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        marginLeft: 20
    },
    listHeader: {
        backgroundColor: '#ff5722',
        marginLeft: 0,
        paddingLeft: 15,
        height: 130,
    },
    headerTextName: {
        color: 'white',
        fontWeight: 'bold'
    },
    headerTextNote: {
        color: 'white',
    }
});