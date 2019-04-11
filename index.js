/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Messaging from './src/Messaging';
import { NativeModules } from "react-native";

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => Messaging.bgMessageHandler);
NativeModules.AppStarter.startMyForegroundService();
