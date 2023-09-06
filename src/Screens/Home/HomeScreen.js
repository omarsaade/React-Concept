import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import Topics from './Topics';
import AnimatedIcon from '../../Components/UI/AnimatedIcon';
import {useSelector, useDispatch} from 'react-redux';
import {setSubscriptionModalVisible} from '../../store/Slice/registerSlice';
import {useBackHandler} from '@react-native-community/hooks';
import RNExitApp from 'react-native-exit-app';

const HomeScreen = ({navigation}) => {
  const isSubscribed = useSelector(state => state.register.isSubscribed);
  const dispatch = useDispatch();

  useBackHandler(() => {
    RNExitApp.exitApp();
  });

  const handlePress = async () => {
    try {
      // Check for camera permission
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'إذن الكاميرا',
          message: 'هذا التطبيق يحتاج إلى إذن الكاميرا لإنشاء الصور.',
          buttonPositive: 'موافق',
          buttonNegative: 'إلغاء',
        },
      );

      // Check for storage permission
      const storagePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'إذن التخزين',
          message: 'هذا التطبيق يحتاج إلى إذن التخزين للوصول إلى الصور.',
          buttonPositive: 'موافق',
          buttonNegative: 'إلغاء',
        },
      );

      if (
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
        storagePermission === PermissionsAndroid.RESULTS.GRANTED
      ) {
        if (!isSubscribed) {
          dispatch(setSubscriptionModalVisible(true));
          console.log('Subscription modal visible');
        } else {
          navigation.navigate('SketchScreen');
          dispatch(setSubscriptionModalVisible(false));
        }
      } else {
        console.log('Camera or storage permission denied');
      }
    } catch (error) {
      console.warn('Error checking permissions:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate('Chat')}
          style={({pressed}) => [styles.button, pressed && styles.pressed]}>
          <ImageBackground
            source={require('../../../assets/Ellipse.png')}
            style={styles.Ellipse}>
            <View style={styles.innerBox}>
              <Text style={styles.miniText}>تحدث مع الذكاء الاصطناعي</Text>
              <Text style={styles.bigText}>إضغط هنا للدردشة</Text>
            </View>
            <AnimatedIcon />
          </ImageBackground>
        </Pressable>
      </View>
      <View style={styles.AiContainer}>
        <Pressable
          style={styles.AiButton}
          onPress={handlePress}
          // onPress={() => {
          //   if (!isSubscribed) {
          //     dispatch(setSubscriptionModalVisible(true));
          //   } else {
          //     navigation.navigate('SketchScreen');
          //     dispatch(setSubscriptionModalVisible(false));
          //   }
          // }}
        >
          <Text style={styles.AiText}>
            إنشاء صورة باستخدام الذكاء الاصطناعي
          </Text>
        </Pressable>
      </View>
      <View>
        <Text style={styles.textCenter}>يمكنك أيضًا الاستمتاع</Text>
      </View>
      <Topics navigation={navigation} />
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111C13',
  },
  header: {
    padding: 24,
    backgroundColor: '#111C13',
    display: 'flex',
    alignItems: 'center',
  },
  innerBox: {
    marginTop: 33,
  },
  miniText: {
    color: '#5E6272',
    fontSize: 12,
    lineHeight: 19.36,
    textAlign: 'center',
    fontFamily: 'DroidArabicKufi',
    fontWeight: 500,
  },
  bigText: {
    color: '#FFFFFF',
    fontFamily: 'DroidArabicKufi',
    fontSize: 22,
    lineHeight: 50,
    textAlign: 'center',
  },
  Ellipse: {
    width: 256,
    height: 256,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  tune: {
    marginTop: 62.5,
  },
  textCenter: {
    fontFamily: 'DroidArabicKufi-Bold',
    fontSize: 20,
    lineHeight: 50,
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.7,
  },
  AiContainer: {
    marginVertical: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Centers the content vertically and horizontally
    width: '90%', // Set the width to 90% of the parent container's width
  },
  AiButton: {
    width: '70%',
    backgroundColor: '#076c38c9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 3,
  },
  AiText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'DroidArabicKufi',
  },
});
