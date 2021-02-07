import React, { Component } from 'react';
import { Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';

export default class Signup extends Component {

    state = {
        id: '',
        password: '',
        name: '',
        signup_result : true,
    };
    componentWillUnmount(){
        console.log("지워짐 ㅋ")
    }
    onSignup() {
        const { navigate } = this.props.navigation;
        fetch('http://192.168.0.11:3000/api/sign-up', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                pw: this.state.password,
                name: this.state.name
            })
        })
        .then((response) => response.json()) //https://ko.javascript.info/fetch
        .then((result) => {
            console.log(result);
            if(result.success == true){
                navigate('Login');
            }
        })
    }

    render() {
        const {navigate} = this.props.navigation;
        let {signup_result} = this.state.signup_result;
        return signup_result ? null : (
            <View style={styles.container}>
                <Text style={styles.titleText}> 가입 신청 하십시오. </Text>
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
               
               <TextInput
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name })}
                    placeholder='name'
                    placeholderTextColor='#adb5bd'
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onSignup.bind(this)}
                >
                    <Text style={styles.buttonText}> 가입 </Text>
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

