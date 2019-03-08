import React, { Component } from 'react';
import { Root } from "native-base";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from 'react-navigation-drawer';
import Login from "./screens/Login";
import Home from "./screens/Home";
import SideBar from "./screens/SideBar";
import ChatScreens from "./screens/chat/index"


const Drawer = createDrawerNavigator(
    {
        Login: { screen: Login },
        Home: { screen: Home },
        ChatScreens: { screen: ChatScreens }
    },
    {
        initialRouteName: "Login",
        contentOptions: {
            activeTintColor: "#e91e63"
        },
        contentComponent: props => <SideBar {...props} />
    }
);

const AppContainer = createAppContainer(Drawer);

export default () => {
    return (
        <Root>
            <AppContainer />
        </Root>
    );
}