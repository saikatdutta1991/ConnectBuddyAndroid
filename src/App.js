import React, { Component } from 'react';
import { Root } from "native-base";
import { createAppContainer, createSwitchNavigator, createStackNavigator } from "react-navigation";
import { createDrawerNavigator } from 'react-navigation-drawer';
import AuthLoadingScreen from "./screens/AuthLoading";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import SideBar from "./screens/SideBar";
import ChatScreens from "./screens/chat/index";
import LogoutScreen from "./screens/Logout";
import ProfileScreen from "./screens/Profile";


const appDrawerNavigator = createDrawerNavigator(
    {
        Home: { screen: Home },
        Profile: { screen: ProfileScreen },
        Logout: { screen: LogoutScreen },
        ChatScreens: { screen: ChatScreens }
    },
    {
        initialRouteName: "Home",
        contentOptions: {
            activeTintColor: "#e91e63"
        },
        contentComponent: props => <SideBar {...props} />
    }
);

const AuthStack = createStackNavigator(
    {
        Login: { screen: Login },
        Register: { screen: Register },
    },
    {
        initialRouteName: "Login",
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }
);


const switchNavigator = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: appDrawerNavigator,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
);


const AppContainer = createAppContainer(switchNavigator);

export default () => {
    return (
        <Root>
            <AppContainer />
        </Root>
    );
}