import React, { Component } from 'react';
import { Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends Component {

    state = {
        id: '',
        password: '',
        isLogin: false
    };
    componentDidMount(){
        const { navigate } = this.props.navigation;
        AsyncStorage.getItem('UserId', (err, result) => {
            console.log(result);   
            if (result == null) {
               this.setState({isLogin : false});
            }         
            else{
                navigate("MainTabs");
            }
        });

    }
    componentWillUnmount(){
        console.log("지워짐 ㅋ")
    }
    onLogin() {
        const { navigate } = this.props.navigation;
        fetch('http://192.168.0.11:3000/api/sign-in', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                pw: this.state.password
            })
        })
        .then((response) => response.json()) //https://ko.javascript.info/fetch
        .then((result) => {
            console.log(result);
            if(result.success == true){
                AsyncStorage.setItem('UserId',this.state.id);
                navigate("MainTabs");
            }
        })
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>로그인 하슈</Text>
                <TextInput
                    value={this.state.id}
                    onChangeText={(id) => this.setState({ id })}
                    placeholder='id'
                    placeholderTextColor='#adb5bd'
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder='password'
                    secureTextEntry={true}
                    placeholderTextColor='#adb5bd'
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onLogin.bind(this)}
                >
                    <Text style={styles.buttonText}> Log In </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigate('Signup')}
                >
                    <Text style={styles.buttonText}> Sign Up </Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf0e6',
    },
    titleText: {
        fontSize: 38,
        color: '#495057',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'white',
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 25,
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 20,
        color: '#495057',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 200,
        fontSize: 20,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: '#868e96',
        marginVertical: 10,
    },
});

