import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {
  useRewardedInterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import {registerDevice} from '../../Services/registerDevice';
import {MixPanelTrack} from '../../Services/MixPanel';
import Toast from 'react-native-simple-toast';
import {errorMessages} from '../../Services/ErrorText';

const AdMob = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);

  const deviceInfo = useSelector(state => state.register.deviceInfo);
  const settings = useSelector(state => state.register.settings);

  let adUnitId =
    Platform.OS == 'ios'
      ? settings.admob_ios_adunit_id
      : settings.admob_android_adunit_id;

  if (settings.enable_admob_test_mode) {
    adUnitId = TestIds.REWARDED_INTERSTITIAL;
  }

  const {isLoaded, isClosed, load, show, error, isEarnedReward} =
    useRewardedInterstitialAd(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
      serverSideVerificationOptions: {
        userId: deviceInfo.admob_user_id,
        customData: settings.admob_token,
      },
    });

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isClosed) {
      navigation.goBack();
    }
  }, [isClosed, navigation]);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      Toast.show(errorMessages.noAdsNow, Toast.LONG);
      // Alert.alert(JSON.stringify(error.message));
      //console.log('error loading ad: ', error);
    }
    if (isLoaded) {
      setIsLoading(false);
      show();
    }
  }, [isLoaded, error]);

  useEffect(() => {
    if (isEarnedReward) {
      //console.log('earned reward!');
      registerDevice();
    }
  }, [isEarnedReward]);

  return (
    <View>
      {isLoading ? (
        <Text
          style={{
            textAlign: 'center',
            paddingTop: 20,
            color: 'black',
            fontFamily: 'DroidArabicKufi-Bold',
          }}>
          تحميل...
        </Text>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: '#111C13',
            margin: 20,
            borderRadius: 40,
          }}
          onPress={() => {
            MixPanelTrack('ads.download');

            load();
            setIsLoading(true);
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'DroidArabicKufi',
              padding: 10,
              textAlign: 'center',
            }}>
            تحميل الإعلانات
          </Text>
        </TouchableOpacity>
      )}

      {error ? (
        <Text
          style={{
            textAlign: 'center',
            paddingTop: 10,
            color: 'grey',
            fontFamily: 'DroidArabicKufi-Bold',
          }}>
          حدث خطأ يرجى إعادة تحميل الإعلان
        </Text>
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

export default AdMob;
