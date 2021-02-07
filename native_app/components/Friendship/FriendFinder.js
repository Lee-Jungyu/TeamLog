import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default class FriendFinder extends Component {
    constructor() {
        super();
        this.state = {
            datas2: [
                { key: "0", data: "ㅅㅂ" },
                { key: "1", data: "개새끼야" },
                { key: "2", data: "으 씨빨" },
                { key: "3", data: "ㄴㅁㄹㄴㅁㄻㄴㄹ" },
                { key: "4", data: "aaㅁㄴㄻㄴㅇㄹaa" },
            ],
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>안녕?</Text>
                <Text style={styles.titleText}>반가워</Text>
                <FlatList
                    data={this.state.datas2}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity>
                                <View style={{ borderWidth: 1, borderRadius: 8, padding: 8, margin: 8 }}>
                                    <Text>{item.key}</Text>
                                    <Text>{item.data}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                >

                </FlatList>
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

