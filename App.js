import React from "react";
import Setup from "./src/boot/Setup";
import firebase from 'react-native-firebase';
import Messaging from './src/Messaging';

export default class App extends React.Component {


	componentDidMount() {
		this.messageListener = firebase.messaging().onMessage(Messaging.fgMessageHandler);
	}


	componentWillUnmount() {
		this.messageListener();
	}

	render() {
		return <Setup />;
	}
} 