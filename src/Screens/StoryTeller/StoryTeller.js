import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Clipboard,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {MESSAGE_URL} from '../../Services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {registerDevice} from '../../Services/registerDevice';
import {useDispatch, useSelector} from 'react-redux';
import ImageRotator from '../../Components/UI/ImageRotator';
import {
  setIsRequestPending,
  setSubscriptionModalVisible,
} from '../../store/Slice/registerSlice';
// import {showMessage} from 'react-native-flash-message';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import '../../Services/Global';
import {errorMessages} from '../../Services/ErrorText';
import {MixPanelTrack} from '../../Services/MixPanel';

const StoryTeller = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isRequestPending = useSelector(
    state => state.register.isRequestPending,
  );
  const remainingTokens = useSelector(
    state => state.register.deviceInfo.remaining_tokens,
  );

  const isSubscribed = useSelector(state => state.register.isSubscribed);

  const {title, legend, example, id} = route.params.code;
  const [isFocused, setIsFocused] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [message, setMessage] = useState(example);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: title,
      legend: legend,
      example: example,
    });
  }, [navigation]);

  const handleCopyText = () => {
    MixPanelTrack('topics.copyText');

    if (textResponse) {
      Clipboard.setString(textResponse);
    }
    Toast.show('تم نسخ النص', Toast.LONG);
  };

  const handleBlur = () => {
    Keyboard.dismiss();
  };

  const handleTopicsPostRequest = async () => {
    MixPanelTrack('topics.sendMessage');

    try {
      if (!isSubscribed && remainingTokens <= 0) {
        Toast.show(errorMessages.noTokens, Toast.LONG);
        dispatch(setSubscriptionModalVisible(true));

        return;
      }

      const netInfoState = await NetInfo.fetch();
      if (!netInfoState.isConnected) {
        Toast.show(errorMessages.noConnection, Toast.LONG);
        return;
      }
      if (message.length < 2 || message.trim() === '') {
        Toast.show(errorMessages.minLength, Toast.LONG);
        return;
      }
      dispatch(setIsRequestPending(true));
      const storedApiKey = await AsyncStorage.getItem('api_key');
      const headers = {
        'Content-Type': 'application/json',
        'api-key': storedApiKey,
      };
      const data = {
        message: message,
        topic_id: id,
      };
      Keyboard.dismiss();
      setIsLoading(true);

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      setTimeout(() => {
        source.cancel();
      }, global.timeOut);

      const response = await axios.post(MESSAGE_URL, data, {
        headers,
        cancelToken: source.token,
      });

      if (response.data.errorMessage) {
        console.error('error sending topic', response.data.errorMessage);
        if (response.data.server_error) {
          Toast.show(errorMessages.serverError, Toast.LONG);
        } else {
          Toast.show(response.data.errorMessage, Toast.LONG);
        }
        setIsLoading(false);
        dispatch(setIsRequestPending(false));
        return false;
      }

      const receivedMessage = {
        message: response.data.data.response,
      };
      //console.log('Message from Topics ', response.data.data.response);
      setMessage(data.message);
      setTextResponse(receivedMessage.message);
      await registerDevice();
      setIsLoading(false);
      dispatch(setIsRequestPending(false));
    } catch (error) {
      console.error(error);
      Toast.show(errorMessages.anErrorOccurred, Toast.LONG);
      setIsLoading(false);
      dispatch(setIsRequestPending(false));
      return false;
    }
  };

  const handleOutsideClick = () => {
    Keyboard.dismiss();
    setMessage(example);
  };

  return (
    <ScrollView style={{backgroundColor: '#111C13', flex: 1}}>
      <TouchableWithoutFeedback onPress={handleOutsideClick}>
        <View style={styles.container}>
          <View>
            <Text style={styles.label}>{legend}</Text>
            <View style={styles.question}>
              <TextInput
                style={styles.textInputStyle}
                placeholder={isFocused ? ' ' : message}
                placeholderTextColor="white"
                onFocus={() => {
                  setIsFocused(true);
                  setTextResponse('');
                }}
                onBlur={handleBlur}
                multiline={true}
                onChangeText={text => setMessage(text)}
                value={message}
              />
              <TouchableOpacity
                onPress={handleTopicsPostRequest}
                disabled={isRequestPending}>
                <Image
                  source={require('../../../assets/compass.png')}
                  style={{width: 26, height: 26}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.label}>الإجابة :</Text>
            <View style={styles.answerText}>
              {isLoading ? (
                <ImageRotator />
              ) : (
                <Text style={styles.textResult}>{textResponse}</Text>
              )}
            </View>
          </View>
          <View style={styles.Options}>
            <Pressable
              onPress={handleCopyText}
              style={({pressed}) => [styles.Btn, pressed && styles.pressed]}>
              <Image source={require('../../../assets/Copy.png')} />
            </Pressable>
            <Pressable
              onPress={() => {
                setTextResponse('');
                setMessage('');
              }}
              style={({pressed}) => [styles.Btn, pressed && styles.pressed]}>
              <Image source={require('../../../assets/undo.png')} />
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default StoryTeller;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    paddingVertical: 40,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
    fontFamily: 'DroidArabicKufi',
    lineHeight: 24,
    alignSelf: 'flex-start',
  },
  textInputStyle: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'DroidArabicKufi',
    color: 'white',
    maxWidth: 230,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  question: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#182e23',
    borderRadius: 12,
    height: 140,
    paddingRight: 24,
    paddingLeft: 24,
    marginBottom: 30,
  },
  textResult: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16.8,
    fontFamily: 'DroidArabicKufi',
    color: 'white',
    justifyContent: 'flex-start',
    textAlign: 'left',
    minHeight: 180,
    //height: 200,
  },
  answerText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#182e23',
    borderRadius: 12,
    padding: 10,
    minHight: 180,
  },
  Options: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  Btn: {
    width: 145,
    height: 58,
    borderRadius: 600,
    borderColor: '#182e23',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
