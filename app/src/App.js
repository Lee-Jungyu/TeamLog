/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
	Button,
} from 'react-native';

//import 'react-native-gesture-handler'
import MainStackNavigator from './components/navigation/MainStackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
class App extends Component {
	render() {
		console.log("Checking App");
		return (
			<MainStackNavigator/>
		);
	}
};

// const styles = StyleSheet.create({
	
// });

export default App;
