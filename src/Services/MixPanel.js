import AsyncStorage from '@react-native-async-storage/async-storage';
import {Mixpanel} from 'mixpanel-react-native';
import {trackAutomaticEvents} from '../../app.json';
import {MixPanelStrings} from './MixPanelStrings';

const getValueString = async (jsonObject, keyString) => {
  const keys = keyString.split('.'); // Split the key string into individual keys

  // Traverse the JSON object based on each key
  for (let key of keys) {
    if (
      typeof jsonObject === 'object' &&
      jsonObject !== null &&
      key in jsonObject
    ) {
      jsonObject = jsonObject[key];
    } else {
      return null; // Key not found or invalid JSON structure
    }
  }

  return jsonObject;
};

export const MixPanelTrack = async trackText => {
  if (!global.mixPanelInstance) {
    return false;
  }
  const text = await getValueString(MixPanelStrings, trackText);
  ////console.log("mixpanel track: ", text);

  if (!text) {
    return false;
  }
  global.mixPanelInstance.track(text);
  global.mixPanelInstance.flush();
};

export const initMixPanel = async () => {
  try {
    const mixpanel_token = await AsyncStorage.getItem('mixpanel_token');

    if (!mixpanel_token) {
      return false;
    }

    global.mixPanelInstance = new Mixpanel(
      mixpanel_token,
      trackAutomaticEvents,
    );

    global.mixPanelInstance.init();

    MixPanelTrack('app.start');

    return true;
  } catch (error) {
    console.error('Error initializing Mixpanel:', error);
    return false;
  }
};
