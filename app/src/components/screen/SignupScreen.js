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
        password_check: "",
        id_check: false
    }

    changeText = (type, changedText) => {
        if(type === 'id') {
            this.setState({id: changedText});
            this.setState({id_check: false});
        }
        if(type === 'name') this.setState({name: changedText});
        if(type === 'password') this.setState({password: changedText});
        if(type === 'password_check') this.setState({password_check: changedText});
    }

    idCheck = async () => {
        if(this.state.id.length === 0) {
            alert('Enter your ID');
            return;
        }

        fetch('http://192.168.0.22:3000/api/users/checkId', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: this.state.id,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status === 'success') {
                this.setState({id_check: true});
                alert('Possible ID');
            }
            else if(responseJson.status === 'existed') {
                alert('Already existed ID');
                return;
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

    signUp = async () => {
        if(this.state.id_check === false) {
            alert('Check your ID');
            return;
        }
        if(this.state.name.length === 0) {
            alert('Enter your name');
            return;
        }
        if(this.state.password.length === 0) {
            alert('Enter your password');
            return;
        }
        if(this.state.password !== this.state.password_check) {
            alert('Check your password');
            return;
        }

        fetch('http://192.168.0.22:3000/api/users/signUp', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: this.state.id,
                user_name: this.state.name,
                password: this.state.password
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status === 'success') {
                alert('Success sign up');
                this.props.navigation.navigate('Home');
                return;
            }
            alert('Caused internal error');
            return;
        })
        .catch((e) => {
            console.log(e);
            alert('Caused internal error');
            return;
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
                    <TouchableOpacity 
                        onPress={() => this.idCheck()}
                    >
                        <Text style={{ backgroundColor: 'skyblue'}}>중복 확인</Text>
                    </TouchableOpacity>
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