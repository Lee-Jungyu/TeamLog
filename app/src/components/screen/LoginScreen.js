import React, { Component } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

class Login extends Component {

    state = {
        id: "",
        password: "",
    }

    changeText = (type, changedText) => {
        if(type === 'id') this.setState({id: changedText});
        if(type === 'password') this.setState({password: changedText});
    }

    login = async () => {
        if(this.state.id.length === 0) {
            alert('Enter your ID');
            return;
        }
        if(this.state.password.length === 0) {
            alert('Enter your Password');
            return;
        }
        
        fetch('http://192.168.0.22:3000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: this.state.id,
                password: this.state.password
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status === 'success') {
                alert('Login Success');
                // 어떤 작업을 해서 세션으로 만들어야 되는거지
                
            }
            else {
                alert('Caused internal error');
            }
        })
        .catch((e) => {
            console.log(e);
            alert('Caused internal error');
            return;
        });
    }

	render()
    {
        console.log("Checking LoginScreen");
        return(
            <View style={{ flexDirection: 'column', padding: 10}}>
                <Text>Login</Text>
                <View style={{ flexDirection: 'row', paddingTop: 10}}>
                    <Text style={{flex: 2}}> ID </Text>
                    <TextInput
                        style={{flex: 8, backgroundColor: 'white'}}
                        onChangeText={(text) => this.changeText('id', text)} />
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 10}}>
                    <Text style={{flex: 2}}> PW </Text>
                    <TextInput
                        style={{flex: 8, backgroundColor: 'white'}}
                        onChangeText={(text) => this.changeText('password', text)} />
                </View>
                <TouchableOpacity 
                    style={{paddingTop: 10,}}
                    onPress={() => this.login()}
                >
                    <Text style={{ backgroundColor: 'skyblue'}}>로그인</Text>
                </TouchableOpacity>
            </View>
        );
    }
};

export default Login;