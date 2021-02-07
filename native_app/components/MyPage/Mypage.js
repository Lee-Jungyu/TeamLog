import React, { Component } from 'react';
import { Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Mypage extends Component {

    state = {
        id: '',
    };
    componentDidMount() {
        AsyncStorage.getItem('UserId', (err, result) => {
            console.log(result);
            this.setState({id : result});
            console.log("id 불러오기 성공");
        });
    }

    componentWillUnmount() {
        console.log("지워짐 ㅋ")
    }

    onLogout() {
        const { navigate } = this.props.navigation;
        fetch('http://192.168.0.11:3000/api/sign-out', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
            })
        })
            .then((response) => response.json()) //https://ko.javascript.info/fetch
            .then((result) => {
                console.log(result);
                if (result.success == true) {
                    AsyncStorage.clear();
                    navigate("Login");
                }
            })
    }

    render() {
        
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>{this.state.id} 로그인 됨</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onLogout.bind(this)}
                >
                    <Text style={styles.buttonText}> Log out </Text>
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

