import React, {Component} from 'react';
import {View} from 'react-native';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, createAppContainer} from '@react-navigation/stack';

import HomeScreen from '../screen/HomeScreen';
import LoginScreen from '../screen/LoginScreen';
import SignupScreen from '../screen/SignupScreen';

const Stack = createStackNavigator();
class MainStackNavigator extends Component {
    render() {
        console.log("Checking MainStackNavigator");
        return(
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{title: 'welcome'}}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{title: 'login'}}
                    />
                    <Stack.Screen
                        name="Signup"
                        component={SignupScreen}
                        options={{title: 'signup'}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default MainStackNavigator;