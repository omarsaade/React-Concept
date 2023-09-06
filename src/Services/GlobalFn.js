import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setCloseButtonVisibility,
  setSubscriptionModalVisible,
  setSubscriptionOffers,
  setSelectedOffer,
  setIsFreeTrialSelected,
} from '../store/Slice/registerSlice';
import {store} from '../store/Index/store';

import {MixPanelTrack} from './MixPanel';
let delayPNumber, closePNumber;
export const HandlePopup = async () => {
  MixPanelTrack('popup.open');
  ////console.log('handle popup');
  store.dispatch(setIsFreeTrialSelected(false));

  const delayP = await AsyncStorage.getItem(
    'subscription_popup_delay_in_seconds',
  );
  const closeP = await AsyncStorage.getItem(
    'close_subscription_popup_delay_in_seconds',
  );

  delayPNumber = parseInt(delayP) * 1000;
  closePNumber = parseInt(closeP) * 1000;

  setTimeout(() => {
    //console.log('delay', delayPNumber);
    //console.log('close', closePNumber);
    store.dispatch(setSubscriptionModalVisible(true));
  }, delayPNumber);
};

export const FrequentPopup = async () => {
  MixPanelTrack('popup.frequent');
  store.dispatch(setIsFreeTrialSelected(false));

  store.dispatch(setSubscriptionOffers([]));
  store.dispatch(setSelectedOffer(null));
  const frequencyP = await AsyncStorage.getItem(
    'subscription_popup_frequency_in_seconds',
  );

  const frequencyPNumber = parseInt(frequencyP) * 1000;

  store.dispatch(setSubscriptionModalVisible(false));
  store.dispatch(setCloseButtonVisibility(false));
  setTimeout(() => {
    store.dispatch(setSubscriptionModalVisible(true));
  }, frequencyPNumber);
};

export const setCloseBtn = async () => {
  store.dispatch(setIsFreeTrialSelected(false));
  const closeP = await AsyncStorage.getItem(
    'close_subscription_popup_delay_in_seconds',
  );
  closePNumber = parseInt(closeP) * 1000;

  setTimeout(() => {
    store.dispatch(setCloseButtonVisibility(true));
  }, closePNumber);
};
