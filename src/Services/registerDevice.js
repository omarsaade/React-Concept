import {Alert, Platform} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
import {REGISTER_URL} from './Api';
import {
  setDataRegistration,
  setSettings,
  setPagesUrl,
  setSplashScreenVisibility,
  setAppInitialized,
} from '../store/Slice/registerSlice.js';
import {store} from '../store/Index/store';
import './Global';
import {errorMessages} from './ErrorText';
import {MixPanelTrack} from './MixPanel';
// import {configurePurchases} from './ConfigurePurchases';
import NetInfo from '@react-native-community/netinfo';

const MAX_RETRY_ATTEMPTS = 3;
let retryAttempts = 0;

//console.log('retryyy', retryAttempts);

/*




Requesr Notification Permission





*/

const requestNotificationPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/*




Get  Fcm Registration





*/

const getFcmRegistrationId = async () => {
  try {
    const authEnabled = await requestNotificationPermission();
    if (authEnabled) {
      const fcmRegistrationId = await messaging().getToken();
      //console.log('FCM registration token:', fcmRegistrationId);
      return fcmRegistrationId;
    } else {
      return 'no_fcm';
    }
  } catch (error) {
    console.error('Error getting FCM registration ID:', error);
    return 'no_fcm';
  }
};

/*




Mixpanel tracking



*/

const trackMixPanelEvent = () => {
  MixPanelTrack('registration.registerDevice');
};

/*





timeZone Offset

*/

const getTimezoneOffsetMinutes = () => {
  return new Date().getTimezoneOffset();
};

/*




Get Device UniqueId Info





*/

const getDeviceUniqueInfo = async () => {
  try {
    const uuid = await DeviceInfo.getUniqueId();
    const model = DeviceInfo.getModel();
    return {uuid, model};
  } catch (error) {
    console.error('Error getting device info:', error);
    return {uuid: 'no_uuid', model: 'no_model'};
  }
};

/*




Get Device Information





*/

export const getDeviceInfo = async () => {
  trackMixPanelEvent();

  const timezoneOffsetMinutes = getTimezoneOffsetMinutes();

  const fcmRegistrationId = await getFcmRegistrationId();

  const {uuid, model} = await getDeviceUniqueInfo();

  const platform = Platform.OS;
  const data = {
    timezone_offset_minutes: timezoneOffsetMinutes.toString(),
    fcm_registration_id: fcmRegistrationId,
    allow_notification: true,
    uuid,
    model,
    platform,
  };

  return data;
};

/*


 


Handle Error    





*/

const handleError = async () => {
  const netInfoState = await NetInfo.fetch();

  if (retryAttempts < MAX_RETRY_ATTEMPTS) {
    retryAttempts++;

    if (!netInfoState.isConnected) {
      Toast.show(errorMessages.errorDuringConnectionRetrying, Toast.SHORT);
    } else {
      Toast.show(errorMessages.serverError, Toast.SHORT);
    }

    return await registerDevice();
  } else {
    //console.log('khallas el 3 times, line 183');

    if (!netInfoState.isConnected) {
      Toast.show(errorMessages.errorDuringConnectionRetrying, Toast.SHORT);

      setTimeout(() => {
        Alert.alert(
          errorMessages.noConnection,
          errorMessages.tryAgain,
          [
            {
              text: 'موافق',
              onPress: () => fetchRegistrationData(),
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
      }, 5000);
    } else {
      Toast.show(errorMessages.serverError, Toast.SHORT);

      setTimeout(() => {
        Alert.alert(
          errorMessages.serverError,
          errorMessages.tryAgain,
          [
            {
              text: 'موافق',
              onPress: () => fetchRegistrationData(),
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
      }, 5000);
    }

    return false;
  }
};

/*       




 Store settings data in AsyncStorage




*/

const storeSettingsInAsyncStorage = async settingsData => {
  const {
    revenue_cat_android_key,
    revenue_cat_ios_key,
    mixpanel_token,
    subscription_popup_delay_in_seconds,
    subscription_popup_frequency_in_seconds,
    close_subscription_popup_delay_in_seconds,
  } = settingsData;

  await AsyncStorage.setItem(
    'revenue_cat_android_key',
    revenue_cat_android_key,
  );
  await AsyncStorage.setItem('mixpanel_token', mixpanel_token);
  await AsyncStorage.setItem('revenue_cat_ios_key', revenue_cat_ios_key);
  await AsyncStorage.setItem(
    'subscription_popup_delay_in_seconds',
    subscription_popup_delay_in_seconds.toString(),
  );
  await AsyncStorage.setItem(
    'subscription_popup_frequency_in_seconds',
    subscription_popup_frequency_in_seconds.toString(),
  );
  await AsyncStorage.setItem(
    'close_subscription_popup_delay_in_seconds',
    close_subscription_popup_delay_in_seconds.toString(),
  );
};

/*







Main registration function








*/

export const registerDevice = async () => {
  try {
    MixPanelTrack('registration.registerDevice');

    const data = await getDeviceInfo();
    const headers = {
      'Content-Type': 'application/json',
    };

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    setTimeout(() => {
      source.cancel();
    }, global.timeOut);

    const response = await axios.post(REGISTER_URL, data, {
      headers,
      cancelToken: source.token,
    });
    console.log('ressssponse', response.data.errorMessage);

    if (response.status == 200 && response.data.status) {
      store.dispatch(setDataRegistration(response.data.data.device));
      store.dispatch(setSettings(response.data.data.settings));
      store.dispatch(setPagesUrl(response.data.data.pages));
      const jsonValue = JSON.stringify(response.data.data.device);

      await AsyncStorage.setItem('DeviceInfo', jsonValue);
      const {api_key} = await response.data.data.device;
      const settingsData = await response.data.data.settings;
      await storeSettingsInAsyncStorage(settingsData);

      await AsyncStorage.setItem('api_key', api_key);

      // await configurePurchases();

      return true;
    } else {
      // Alert.alert('else', response.data.errorMessage);
      // console.log('resssse', response.data.errorMessage);
      return await handleError();
    }
  } catch (error) {
    // Alert.alert('catch', error.message);
    // console.log('error', error.message);
    return await handleError();
  }
};

/*      




fetchRegistration





*/

export const fetchRegistrationData = async () => {
  MixPanelTrack('registration.registerDevice');
  const res = await registerDevice();

  if (res) {
    store.dispatch(setAppInitialized(true));
    store.dispatch(setSplashScreenVisibility(false));
  } else {
    if (retryAttempts < MAX_RETRY_ATTEMPTS) {
      //console.log(retryAttempts);
      store.dispatch(setAppInitialized(false));

      Toast.show(errorMessages.errorDuringConnection, Toast.LONG);

      retryAttempts++;
      setTimeout(() => {
        fetchRegistrationData();
      }, 3000);
    } else {
      // Handle the case when maximum retry attempts are reached.
      store.dispatch(setAppInitialized(false));

      return null;
    }
  }
};

/*






Handle Notification






*/
export const handleNotification = async remoteMessage => {
  try {
    //console.log('remote', remoteMessage);

    Alert.alert(
      remoteMessage.notification.title,
      remoteMessage.notification.body,
      [
        {
          text: 'موافق',
          onPress: () => console.log('Custom button pressed!'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  } catch (error) {}
};

/*





Notification Listener






*/

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp(handleNotification);
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        handleNotification(remoteMessage);
      }
    });

  messaging().onMessage(handleNotification);
};
