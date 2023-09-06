import {SketchCanvas} from '@sourcetoad/react-native-sketch-canvas';
import React, {Fragment, useState, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {keyboardProps} from '../../Services/GetiPhoneModel';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../../Services/Global';
import {IMAGE_URL} from '../../Services/Api';
import NetInfo from '@react-native-community/netinfo';
import {MixPanelTrack} from '../../Services/MixPanel';
import {errorMessages} from '../../Services/ErrorText';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAIDisplayed,
  setSubscriptionModalVisible,
  setAiImageUrl,
  setSketchPending,
} from '../../store/Slice/registerSlice';
import ImageModal from './ImageModal';
import LoadingModal from '../../Components/UI/LoadingModal';

const SketchScreen = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const inputRef = React.useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('ارسم رجلاً');
  const isSubscribed = useSelector(state => state.register.isSubscribed);
  const isAIDisplayed = useSelector(state => state.register.isAIDisplayed);
  const isSketchPending = useSelector(state => state.register.isSketchPending);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(false);

  const handleToggleKeyboard = () => {
    if (isKeyboardOpen) {
      Keyboard.dismiss();
    } else {
      inputRef.current.focus();
    }
    setIsKeyboardOpen(!isKeyboardOpen);
  };

  const sendDataToApi = async base64Result => {
    MixPanelTrack('aiImage.sendImage');
    try {
      if (!isSubscribed) {
        dispatch(setSubscriptionModalVisible(true));
        return false;
      }

      const netInfoState = await NetInfo.fetch();
      if (!netInfoState.isConnected) {
        Toast.show(errorMessages.noConnection, Toast.LONG);
        return false;
      }

      if (text.trim() === '' || isCanvasEmpty) {
        Toast.show(errorMessages.drawAndAddText, Toast.SHORT);
        return false;
      }

      const storedApiKey = await AsyncStorage.getItem('api_key');

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      const headers = {
        'Content-Type': 'application/json',
        'api-key': storedApiKey,
      };

      setTimeout(() => {
        source.cancel();
      }, 50000);

      const data = {
        text: text,
        image: `data:image/png;base64,${base64Result}`,
      };

      dispatch(setSketchPending(true));
      const response = await axios.post(IMAGE_URL, data, {
        headers,
        cancelToken: source.token,
      });

      dispatch(setSketchPending(false));
      if (response.data.errorMessage) {
        if (response.data.server_error) {
          console.error('error from sketch ai', response.data);

          Toast.show(errorMessages.serverError, Toast.LONG);
        } else {
          Toast.show(response.data.errorMessage, Toast.LONG);
        }

        return false;
      }

      if (response.data.status) {
        dispatch(setAiImageUrl(response.data.data));
        dispatch(setAIDisplayed(true));
      } else {
        dispatch(setAIDisplayed(false));
      }
    } catch (error) {
      console.error('Error sending data to API:', error);
      Toast.show(errorMessages.dataFailed, Toast.SHORT);
      dispatch(setSketchPending(false));
    }
  };

  const ClearImage = () => {
    //console.log('clear');
    canvasRef.current.clear();
    setIsCanvasEmpty(true);
  };

  return (
    <KeyboardAvoidingView {...keyboardProps} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Fragment>
          {isSketchPending && <LoadingModal />}
          {isAIDisplayed && <ImageModal />}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={ClearImage}>
              <Text style={styles.buttonText}>مسح</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                canvasRef.current.undo();
              }}>
              <Text style={styles.buttonText}>تراجع</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonTxt}
              onPress={handleToggleKeyboard}>
              <Text style={styles.buttonText}>
                {isKeyboardOpen ? 'غلق لوحة المفاتيح' : 'فتح لوحة المفاتيح'}
              </Text>
            </TouchableOpacity>
          </View>
          <SketchCanvas
            localSourceImage={{
              filename: 'whale.png',
              directory: SketchCanvas.MAIN_BUNDLE,
              mode: 'AspectFit',
            }}
            ref={canvasRef}
            style={{flex: 1}}
            strokeColor="#000000"
            strokeWidth={3}
            onStrokeStart={() => setIsCanvasEmpty(false)} // SketchScreen is not empty when drawing starts
            onStrokeEnd={() => {}}
          />

          <View style={styles.bigContainer}>
            <Text style={styles.label}>
              حوّل كلماتك و رسمك إلى فن بواسطة الذكاء الاصطناعي !
            </Text>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.question}>
                <TextInput
                  ref={inputRef}
                  style={styles.textInputStyle}
                  placeholderTextColor="white"
                  multiline={true}
                  onFocus={() => {
                    setIsFocused(true);
                    setIsKeyboardOpen(true);
                  }}
                  numberOfLines={10}
                  onBlur={() => setIsFocused(false)}
                  onChangeText={inputText => setText(inputText)}
                  value={text}
                />

                <TouchableOpacity
                  onPress={() => {
                    if (!isCanvasEmpty) {
                      canvasRef.current.getBase64(
                        'jpg',
                        false,
                        true,
                        true,
                        true,
                        (err, result) => {
                          // //console.log('result', result);
                          // setBase64Image(result);
                          // setTimeout(() => {
                          //   //console.log('timeoutttt', base64Image);
                          sendDataToApi(result);
                          // }, 10000);
                        },
                      );
                    } else {
                      Toast.show(errorMessages.drawAndAddText, Toast.SHORT);
                    }
                  }}>
                  <Image
                    source={require('../../../assets/compass.png')}
                    style={{width: 26, height: 26}}
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Fragment>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  label: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
    paddingBottom: 10,
    fontFamily: 'DroidArabicKufi',
    lineHeight: 24,
    alignSelf: 'flex-start',
    paddingTop: 10,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 12,
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
    borderColor: '#123825',
    borderRadius: 12,
    height: Platform.OS === 'ios' ? 210 : 180,
    paddingRight: 24,
    paddingLeft: 24,
    marginBottom: 40,
  },
  bigContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#111C13',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#182e23',
    borderRadius: 5,
  },
  buttonTxt: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#182e23',
    borderRadius: 5,
    width: 170,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'DroidArabicKufi',
    fontSize: 12,
  },
});
export default SketchScreen;
