// Stack-navigator reference :
// https://reactnavigation.org/docs/stack-navigator
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import MainTabs from './MainTabs';
import Login from './MyPage/Login';
import Signup from './MyPage/Signup';

const TransitionScreenOptions = {
    ...TransitionPresets.SlideFromRightIOS,
};

const Stack = createStackNavigator();
function Container() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName = "Login" >
                <Stack.Screen name="MainTabs" component={MainTabs}
                options={{headerShown: false}} />
                <Stack.Screen name="Login" component={Login} 
                options={{headerShown: false}} />
                <Stack.Screen name="Signup" component={Signup} screenOptions={TransitionScreenOptions} />
            </Stack.Navigator>
        </NavigationContainer>

    );
}
export default Container;