import React, { Component } from 'react';
import { createStackNavigator } from "react-navigation";
import ChatUsers from "./Users";
import Chat from "./Chat";


const stackNativagator = createStackNavigator(
    {
        ChatUsers: { screen: ChatUsers },
        Chat: { screen: Chat }
    },
    {
        initialRouteName: "ChatUsers",
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }
);

export default stackNativagator;