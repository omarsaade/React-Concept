import React, {useState, useRef, Fragment, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import InitialInteractionChat from './InitialInteractionChat';
import Question from './Question';
import Answer from './Answer';
import {useSelector, useDispatch} from 'react-redux';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import SendMessage from '../../Services/Messaging';
import {keyboardProps} from '../../Services/GetiPhoneModel';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {errorMessages} from '../../Services/ErrorText';
import {setSubscriptionModalVisible} from '../../store/Slice/registerSlice';
const {width} = Dimensions.get('window');

const ChatScreen = () => {
  const scrollViewRef = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const isSubscribed = useSelector(state => state.register.isSubscribed);
  const DialogueLog = useSelector(state => state.register.DialogueLog);
  const firstMessage = useSelector(state => state.register.firstMessage);
  const messageHasMoreContent = useSelector(
    state => state.register.messageHasMoreContent,
  );
  const isRequestPending = useSelector(
    state => state.register.isRequestPending,
  );
  const remainingTokens = useSelector(
    state => state.register.deviceInfo.remaining_tokens,
  );

  const sendMessageHandler = async () => {
    //console.log('pressed');
    if (!isSubscribed && remainingTokens < 0) {
      Toast.show(errorMessages.noTokens, Toast.LONG);
      dispatch(setSubscriptionModalVisible(true));

      return false;
    }

    if (message.length < 2 || message.trim() === '') {
      Toast.show(errorMessages.minLength, Toast.LONG);
      return false;
    }
    const netInfoState = await NetInfo.fetch();

    if (!netInfoState.isConnected) {
      Toast.show(errorMessages.noConnection, Toast.LONG);
      return false;
    }
    const messageToSend = message;
    setMessage('');
    await SendMessage(messageToSend, false, false, firstMessage);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollViewRef.current.scrollToEnd({animated: true});
      },
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView {...keyboardProps} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Fragment>
          <ScrollView
            style={{flex: 1, marginBottom: 10}}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({animated: true})
            }>
            <InitialInteractionChat />

            {DialogueLog.map((item, index) =>
              item.type == 'received' ? (
                <Answer
                  key={uuidv4()}
                  txt={item.message}
                  date={item.date}
                  isLoading={item.status}
                  messageHasMoreContent={
                    DialogueLog.length - 1 == index && messageHasMoreContent
                  }
                />
              ) : (
                <Question
                  key={uuidv4()}
                  txt={item.message}
                  date={item.date}
                  isSent={item.isSent}
                />
              ),
            )}
          </ScrollView>
          <View style={styles.bottomBar}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.inner}>
                <TextInput
                  numberOfLines={2}
                  multiline={true}
                  style={styles.textInput}
                  placeholderTextColor="grey"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isFocused ? 'رد' : 'اكتب ردًا'}
                  onChangeText={text => setMessage(text)}
                  value={message}
                />
                <TouchableOpacity
                  onPress={sendMessageHandler}
                  disabled={isRequestPending}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={require('../../../assets/compass.png')}
                      style={{width: 26, height: 26, marginRight: 5}}
                    />
                  </View>
                  <View style={{marginRight: 20}} />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Fragment>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111C13',
  },
  inner: {
    paddingHorizontal: 24,
    flex: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    borderStyle: 'solid',
    height: 60,
    borderWidth: 1.5,
    borderColor: '#233f31',
    borderRadius: 60,
    // width: 327,
    width: width < 400 ? 327 : 440,
    marginBottom: 10,
  },
  textInput: {
    fontSize: 13,
    height: 55,
    color: 'white',
    textAlign: 'right',
    writingDirection: 'rtl',
    width: 230,
    maxWidth: 230,
    paddingTop: Platform.OS === 'android' ? 4 : 15,
    paddingBottom: 4,
    fontFamily: 'DroidArabicKufi',
  },
  bottomBar: {
    backgroundColor: '#111C13',
  },
});
