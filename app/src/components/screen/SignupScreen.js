import React, {Component} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
    Button,
    TouchableOpacity
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import {withNavigation} from 'react-navigation';

class SignupScreen extends Component {

    state = {
        id: "",
        name: "",
        password: "",
        password_check: ""
    }

    changeText = (type, changedText) => {
        if(type === 'id') this.setState({id: changedText});
        if(type === 'name') this.setState({name: changedText});
        if(type === 'password') this.setState({password: changedText});
        if(type === 'password_check') this.setState({password_check: changedText});
    }

    signUp = async () => {
        
        if(this.state.password !== this.state.password_check) {
            alert('Check your password');
            return;
        }

        let userData = new FormData();
        userData.append('id', this.state.id);
        userData.append('name', this.state.name);
        userData.append('password', this.state.password);
        
        console.log(userData);

        fetch('http://192.168.0.22:3000/api/users/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                name: this.state.name,
                password: this.state.password
            })
        })
        .then((response) => response.text())
        .then((responseJson) => {
            let json = JSON.stringify(responseJson)
            console.log(json);
        })
    }

    render()
    {
        console.log("Checking SignupScreen");
        return(
            <View style={{ flexDirection: 'column', padding : 10}}>
                <Text>Signup</Text>
                <View style={{flexDirection: 'row', paddingTop: 10}}>
                    <Text style={{flex: 2, justifyContent: 'center'}}>ID</Text>
                    <TextInput
                        style={{flex: 8, backgroundColor: 'white'}}
                        onChangeText={(text) => this.changeText('id', text)} />
                </View>
                <View style={{flexDirection: 'row', paddingTop: 10}}>
                    <Text style={{flex: 2, justifyContent: 'center'}}>이름</Text>
                    <TextInput
                        style={{flex: 8, backgroundColor: 'white'}}
                        onChangeText={(text) => this.changeText('name', text)} />
                </View>
                <View style={{flexDirection: 'row', paddingTop: 10}}>
                    <Text style={{flex: 2, justifyContent: 'center'}}>비밀번호</Text>
                    <TextInput
                        style={{flex: 8, backgroundColor: 'white'}}
                        onChangeText={(text) => this.changeText('password', text)} />
                </View>
                <View style={{flexDirection: 'row', paddingTop: 10}}>
                    <Text style={{flex: 2, justifyContent: 'center'}}>비밀번호 확인</Text>
                    <TextInput
                        style={{flex: 8, backgroundColor: 'white'}}
                        onChangeText={(text) => this.changeText('password_check', text)} />
                </View>
                <TouchableOpacity 
                    style={{paddingTop: 10,}}
                    onPress={() => this.signUp()}
                >
                    <Text style={{ backgroundColor: 'skyblue'}}>회원 가입</Text>
                </TouchableOpacity>
            </View>
        );
    }
};


export default withNavigation(SignupScreen);