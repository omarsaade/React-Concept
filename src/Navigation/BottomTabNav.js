import React from 'react';
import {Image, StyleSheet, View, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/Home/HomeScreen';
import SettingsScreen from '../Screens/Settings/SettingsScreen';
import homePng from '../../assets/home.png';
import settingImg from '../../assets/settings.png';

const BottomTabs = createBottomTabNavigator();

const BottomTabNav = () => {
  return (
    <BottomTabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        tabBarStyle: {
          backgroundColor: '#111C13',
          borderTopWidth: 0,
          height: 60,
        },
        tabBarActiveTintColor: '#6EA95C',
      }}>
      <BottomTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabBarIconContainer}>
              <Image
                source={homePng}
                style={{tintColor: focused ? '#6EA95C' : '#2F5034'}}
              />
              {focused && <View style={styles.tabBarBadge} />}
            </View>
          ),
        }}
      />
      <BottomTabs.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabBarIconContainer}>
              <Image
                source={settingImg}
                style={{tintColor: focused ? '#6EA95C' : '#2F5034'}}
              />
              {focused && <View style={styles.tabBarBadge} />}
            </View>
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
};

export default BottomTabNav;

const styles = StyleSheet.create({
  tabBarIconContainer: {
    position: 'relative',
    alignItems: 'center',
    padding: 6,
    marginTop: Platform.OS === 'android' ? 0 : 15,
  },
  tabBarBadge: {
    position: 'absolute',
    bottom: 0,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#6EA95C',
  },
});
