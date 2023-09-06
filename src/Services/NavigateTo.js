import {Linking} from 'react-native';
import {MixPanelTrack} from './MixPanel';
const navigateTo = async url => {
  try {
    await Linking.openURL(url);
    MixPanelTrack("navigation.openUrl");
  } catch (error) {
    console.error('Error opening URL:', error);
  }
};

export default navigateTo;
