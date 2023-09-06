import {Dimensions, Platform} from 'react-native';
import {MixPanelTrack} from './MixPanel';
const {height, width} = Dimensions.get('window');

const getiPhoneModel = () => {
  MixPanelTrack('registration.getPhoneModel');

  if (Platform.OS === 'ios') {
    if (height >= 800 || width >= 800) {
      return 'iPhone X';
    } else if (height <= 700 || width <= 700) {
      return 'iPhone 7';
    }
  }
  return 'Unknown';
};

export default getiPhoneModel;

export const keyboardProps = Platform.select({
  ios: {
    behavior: 'padding',
    keyboardVerticalOffset: getiPhoneModel() === 'iPhone X' ? 100 : 60,
  },
  android: {},
});
