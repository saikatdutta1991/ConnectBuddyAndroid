import React, { Component } from 'react';
import { createStackNavigator } from "react-navigation";
import ChatUsers from "./Users";
import Chat from "./Chat";
import CallScreen from "./video/Call";


const stackNativagator = createStackNavigator(
    {
        ChatUsers: { screen: ChatUsers },
        Chat: { screen: Chat },
        Call: { screen: CallScreen }
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