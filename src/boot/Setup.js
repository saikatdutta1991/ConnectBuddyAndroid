import React, { Component } from 'react';
import { Container, Button, Text, StyleProvider } from 'native-base';
import getTheme from "../../native-base-theme/components";
import customColor from '../../native-base-theme/variables/customColor';
import App from "../App";

export default class Setup extends Component {

    render() {
        return (
            <StyleProvider style={getTheme(customColor)}>
                <App />
            </StyleProvider>
        );
    }

}