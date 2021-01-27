import React, {Component} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
	Button,
} from 'react-native';

import {withNavigation} from 'react-navigation';

class HomeScreen extends Component {
    render()
    {
        console.log("Checking HomeScreen");
        return(
            <View>
                <Text>Hello</Text>
                <Button 
                    title="로그인 페이지로 이동" 
                    onPress={() => {this.props.navigation.navigate('Login')}} />
                <Button 
                    title="회원가입 페이지로 이동" 
                    onPress={() => {this.props.navigation.navigate('Signup')}} />
            </View>
        );
    }
};


export default withNavigation(HomeScreen);