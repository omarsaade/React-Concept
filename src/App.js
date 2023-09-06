import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {View, I18nManager, BackHandler} from 'react-native';
import StackNav from './Navigation/StackNav';
import Splash from './Components/SplashScreen/Splash';
import SplashScreen from 'react-native-splash-screen';
import {useSelector, useDispatch} from 'react-redux';
import {configureAds, getSubscriptionInfo} from './Services/ConfigurePurchases';
import {fetchRegistrationData} from './Services/registerDevice';
import {HandlePopup} from './Services/GlobalFn';
import Purchases from 'react-native-purchases';
import {initMixPanel} from './Services/MixPanel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setIsFreeTrialSelected} from './store/Slice/registerSlice';
import {NotificationListener} from './Services/registerDevice';

const App = () => {
  const dispatch = useDispatch();
  const isSplashScreenVisible = useSelector(
    state => state.register.isSplashScreenVisible,
  );
  const isSubscribed = useSelector(state => state.register.isSubscribed);
  const subscriptionInitialized = useSelector(
    state => state.register.subscriptionInitialized,
  );

  I18nManager.forceRTL(true);

  useEffect(() => {
    Purchases.addCustomerInfoUpdateListener(getSubscriptionInfo);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(getSubscriptionInfo);
    };
  });

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    AsyncStorage.removeItem('purchasesInitialized');
    fetchRegistrationData();
  }, []);

  useEffect(() => {
    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   () => {
    //     return true;
    //   },
    // );

    NotificationListener();

    // return () => {
    //   backHandler.remove();
    // };
  }, []);

  useEffect(() => {
    if (subscriptionInitialized) {
      initMixPanel();
      if (!isSubscribed) {
        dispatch(setIsFreeTrialSelected(false));
        HandlePopup();
      }
    }
  }, [subscriptionInitialized]);

  useEffect(() => {
    configureAds();
  }, []);

  if (isSplashScreenVisible) {
    return <Splash />;
  }

  return (
    <View style={{flex: 1}}>
      <StackNav />
    </View>
  );
};

export default App;
