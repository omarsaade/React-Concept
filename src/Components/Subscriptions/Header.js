import React from 'react';
import {View, Image, Text, StyleSheet, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import {FrequentPopup} from '../../Services/GlobalFn';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {MixPanelTrack} from '../../Services/MixPanel';

const Features = [
  'استخدام غير محدود / أسئلة وأجوبة',
  'تجربة خالية من الإعلانات',
  'عدد أكبر من الكلمات في الردود',
  'التزامات، يمكن إلغاء الاشتراك في أي وقت',
];

const Header = () => {
  const isCloseButtonVisible = useSelector(
    state => state.register.isCloseButtonVisible,
  );
  const isSubscribed = useSelector(state => state.register.isSubscribed);
  const purchaseInProcess = useSelector(
    state => state.register.purchaseInProcess,
  );

  const handleClick = async () => {
    MixPanelTrack('popup.close');
    if (isSubscribed) {
      return false;
    } else {
      await FrequentPopup();
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{width: 20, marginTop: 10, height: 30}}>
        {isCloseButtonVisible && !purchaseInProcess && (
          <Pressable onPress={handleClick}>
            <Image
              style={{marginLeft: 20, width: 20, opacity: 0.5}}
              source={require('../../../assets/remove-circle.png')}
            />
          </Pressable>
        )}
      </View>
      <View style={{alignItems: 'center'}}>
        <Image source={require('../../../assets/Graph.png')} />
        <View style={styles.subscContainer}>
          <Text style={styles.subscText}>اشتراك محترف</Text>
        </View>
        <Text style={styles.upgradeText}>الترقية إلى النسخة المحترفة</Text>
      </View>
      <View style={styles.featuresContainer}>
        {Features.map(item => (
          <View style={styles.container} key={uuidv4()}>
            <Image
              style={{marginRight: 12}}
              source={require('../../../assets/FrameA.png')}
            />
            <Text style={styles.featuresItem}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 17,
  },
  featuresContainer: {
    paddingLeft: 40,
  },
  featuresItem: {
    color: 'white',
    fontSize: 11.5,
    lineHeight: 22.4,
    fontFamily: 'DroidArabicKufi',
    color: '#FFFFFF',
  },
  subscContainer: {
    borderRadius: 30,
    backgroundColor: '#076C38',
    paddingHorizontal: 17,
    paddingVertical: 18,
    marginTop: 10,
  },
  subscText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'DroidArabicKufi-Bold',
  },
  upgradeText: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 44,
    fontFamily: 'DroidArabicKufi-Bold',
  },
});
