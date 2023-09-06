import {store} from '../store/Index/store';
import {Keyboard} from 'react-native';
import {
  setNewMessage,
  updateMessage,
  removeLastItemFromDialogue,
  setIsRequestPending,
  setMessageHasMoreContent,
  setFirstMessage,
  markMessageAsSentByText,
} from '../store/Slice/registerSlice';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MESSAGE_URL} from './Api';
import axios from 'axios';
import {registerDevice} from './registerDevice';
import './Global';
import {errorMessages} from './ErrorText';
import {MixPanelTrack} from './MixPanel';

const SendMessage = async (
  message,
  reload = false,
  more = false,
  firstMessage = true,
) => {
  try {
    MixPanelTrack('chat.sendMessage');

    store.dispatch(setIsRequestPending(true));
    store.dispatch(setMessageHasMoreContent(false));
    const storedApiKey = await AsyncStorage.getItem('api_key');
    const headers = {
      'Content-Type': 'application/json',
      'api-key': storedApiKey,
    };

    if (!reload && !more) {
      store.dispatch(
        setNewMessage({
          type: 'sent',
          message: message,
          date: new Date(),
          status: true,
          isSent: true,
        }),
      );
    }

    Keyboard.dismiss();

    const loadingMessage = {
      type: 'received',
      message: '',
      date: new Date(),
      status: true,
    };

    store.dispatch(setNewMessage(loadingMessage));
    const data = {
      message: message,
      read_more: more,
      first_message: firstMessage,
    };

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
      //console.log('dataERORRRR', response.data.errorMessage);
      if (response.data.server_error) {
        Toast.show(errorMessages.serverError, Toast.LONG);
      } else {
        Toast.show(response.data.errorMessage, Toast.LONG);
      }

      return await sendingMessageError(message, reload, more);
    }

    if (response.data.data.is_there_more_content) {
      //console.log('ufffff');
      store.dispatch(setMessageHasMoreContent(true));
    } else {
      store.dispatch(setMessageHasMoreContent(false));
    }

    const reponseMessage = {
      type: 'received',
      message: response.data.data.response,
      date: new Date(),
      status: false,
    };

    store.dispatch(updateMessage(reponseMessage));
    store.dispatch(setIsRequestPending(true));

    await registerDevice();
    store.dispatch(setFirstMessage(false));
    store.dispatch(setIsRequestPending(false));
    return true;
  } catch (error) {
    return await sendingMessageError(message, reload, more);
  }
};

export default SendMessage;

const sendingMessageError = async (message, reload = false, more = false) => {
  MixPanelTrack('chat.sendMessageError');

  Toast.show(errorMessages.anErrorOccurred, Toast.LONG);
  store.dispatch(setIsRequestPending(false));
  store.dispatch(removeLastItemFromDialogue());

  if (!more) {
    const receivedMessage = {
      type: 'sent',
      message: message,
      date: new Date(),
      status: false,
    };
    store.dispatch(updateMessage(receivedMessage));
  } else {
    store.dispatch(setMessageHasMoreContent(true));
  }

  return false;
};

export const ResendMessage = async (message, firstMessage) => {
  MixPanelTrack('chat.resendMessage');

  // const receivedMessage = {
  //   type: 'sent',
  //   message: message,
  //   date: new Date(),
  //   status: true,
  //   isSent: true,
  // };
  // store.dispatch(updateMessage(receivedMessage));
  store.dispatch(markMessageAsSentByText(message));
  return SendMessage(message, true, false, firstMessage);
};
