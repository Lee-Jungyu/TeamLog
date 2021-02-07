import React, { Component } from 'react';
import {Text, View, StyleSheet } from 'react-native';

export default class Login extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>안녕?</Text>
                <Text style={styles.titleText}>반가워</Text>
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
        fontSize: 50,
        color: '#495057',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

