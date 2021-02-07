// Bottom-tab-navigator reference :
// https://reactnavigation.org/docs/bottom-tab-navigator/
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Mypage from './MyPage/Mypage';
import FriendFinder from './Friendship/FriendFinder';

const Tab = createBottomTabNavigator();

function MainTabs() {
    return (

        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="FriendFinder" component={FriendFinder} />
            <Tab.Screen name="MyPage" component={Mypage} />
        </Tab.Navigator>

    );
}
export default MainTabs;