import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Image,
  Pressable,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  AppState,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import ChatScreen from '../Screens/Chat/ChatScreen';
import DrawNav from './DrawNav';
import directionRight from '../../assets/rightarrowicon.png';
import StoryTeller from '../Screens/StoryTeller/StoryTeller';
import Splash from '../Components/SplashScreen/Splash';
import AdMob from '../Screens/Ads/AdMob';
import SubscriptionDetails from '../Components/Subscriptions/SubscriptionDetails';
import SubscriptionModal from '../Components/Modal/SubscriptionModal';
import {fetchRegistrationData} from '../Services/registerDevice';
import SketchScreen from '../Screens/ImageAi/SketchScreen';
import {configurePurchases} from '../Services/ConfigurePurchases';

const Stack = createNativeStackNavigator();

const StackNav = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        fetchRegistrationData();
        //console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      //console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    configurePurchases();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#111C13'}}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#111C13" />
        <SubscriptionModal />
        <Stack.Navigator
          screenOptions={({navigation}) => ({
            headerStyle: {backgroundColor: '#111C13'},
            headerTintColor: '#FFFFFF',
            headerBackVisible: false,
            headerBackTitle: 'رجوع',
            headerTruncatedBackTitle: 'رجوع',
            headerBackTitleVisible: false,
            headerLeft:
              Platform.OS === 'android'
                ? null
                : ({canGoBack}) =>
                    canGoBack && (
                      <View style={{paddingHorizontal: 0}}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.goBack();
                          }}
                          style={{flexDirection: 'row'}}>
                          <Image
                            style={{
                              marginRight: 0,
                              width: 20,
                              height: 40,
                              resizeMode: 'contain',
                            }}
                            source={require('../../assets/chevron-right.png')}
                          />
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 18,
                              fontFamily: 'DroidArabicKufi',
                            }}>
                            رجوع
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ),
            headerRight:
              Platform.OS === 'android'
                ? () => (
                    <Pressable
                      style={({pressed}) => [
                        styles.button,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => navigation.goBack()}>
                      <Image
                        source={directionRight}
                        style={{
                          tintColor: 'white',
                          width: 22,
                          height: 22,
                        }}
                      />
                    </Pressable>
                  )
                : null,
            headerTitleStyle: {
              fontFamily: 'DroidArabicKufi-Bold',
            },
          })}>
          <Stack.Screen
            name="Root"
            component={DrawNav}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              headerTitle: 'دردشة',
            }}
          />
          <Stack.Screen name="Story" component={StoryTeller} />

          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AdMob"
            component={AdMob}
            options={{
              headerTitle: 'إعلانات',
            }}
          />
          <Stack.Screen
            name="SketchScreen"
            component={SketchScreen}
            options={{
              headerTitle: 'ارسم اللوحه',
            }}
          />

          <Stack.Screen
            name="SubscriptionDetails"
            component={SubscriptionDetails}
            options={{
              headerTitle: 'معلومات الاشتراك',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default StackNav;

const styles = StyleSheet.create({
  button: {
    marginRight: Platform.OS === 'android' ? 20 : null,
    backgroundColor: '#213625',
    borderRadius: 20,
    padding: 4,
    textAlign: 'center',
  },
});
