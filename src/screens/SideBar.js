import React, { Component } from 'react';
import { StyleSheet, Platform, FlatList, Alert } from 'react-native';
import { Content, Text, ListItem, Icon, Container, Left, Thumbnail, View } from "native-base";
import authuser from "../AuthUser";
import gStorage from "../GInmemStorage";
import CustomColor from '../../native-base-theme/variables/customColor';
import MatIcon from "react-native-vector-icons/MaterialIcons";

const datas = [
    {
        name: "Map",
        route: "Home",
        icon: "map"
    },
    {
        name: "Search",
        route: "SearchUsers",
        icon: "search"
    },
    {
        name: "Friend Requests",
        route: "FriendRequests",
        icon: "people-outline"
    },
    {
        name: "Messages",
        route: "ChatUsers",
        icon: "chat",
    },
    {
        name: "Account",
        route: "Profile",
        icon: "account-circle",
    },
    {
        name: "App Info",
        route: "Aboutus",
        icon: "info-outline",
    }
];

const LogoutRoute = {
    name: "Sing Out",
    route: "Logout",
    icon: "power-settings-new",
}



export default class SideBar extends Component {


    constructor(props) {
        super(props);
        this.state = {
            authuser_image: authuser.getImageurl(),
            authuser_name: authuser.getName(),
            authuser_email: authuser.getEmail()
        };
    }


    componentDidMount() {

        /** store main manu state to global storage for change from another component */
        gStorage.mainMenu = this;
    }



    _logoutAlert = () => {
        Alert.alert(
            'Confirm',
            'Are you sure that you want to logout?',
            [
                {
                    text: 'Yes', onPress: () => {
                        this.props.navigation.navigate(LogoutRoute.route)
                    }
                },
                { text: 'Cancel', onPress: () => { } }
            ]
        );
    }



    _keyExtractor = (item, index) => item.name;

    _renderItem = ({ item }) => (
        <ListItem
            button

            onPress={() => this.props.navigation.navigate(item.route)}
        >
            <Left>
                <MatIcon name={item.icon} color={CustomColor.brandPrimary} size={27} />
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

                    <View style={styles.listHeader}>
                        <Thumbnail style={{ width: 100, height: 100, borderRadius: 100, borderWidth: 2, borderColor: 'white' }} source={{ uri: this.state.authuser_image }} />
                        <Text style={styles.headerTextName}>{this.state.authuser_name}</Text>
                        <Text style={styles.headerTextEmail}>{this.state.authuser_email}</Text>
                    </View>

                    <FlatList
                        data={datas}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                    <ListItem
                        button

                        onPress={this._logoutAlert}
                    >
                        <Left>
                            <MatIcon name={LogoutRoute.icon} color={CustomColor.brandPrimary} size={27} />
                            <Text style={styles.text}>
                                {LogoutRoute.name}
                            </Text>
                        </Left>
                    </ListItem>
                </Content>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        marginLeft: 20,
        color: CustomColor.brandPrimary
    },
    listHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CustomColor.brandPrimary,
        paddingTop: 20,
        paddingBottom: 20
    },
    headerTextName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 2
    },
    headerTextEmail: {
        color: 'white',
        fontSize: 15,
        marginTop: 5
    }
});