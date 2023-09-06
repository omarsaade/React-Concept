import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Clipboard,
} from 'react-native';
import formatDateToUUKK from '../../Services/FormattedDate';
import Skeleton from '../../Components/UI/Skeleton';
import {useSelector, useDispatch} from 'react-redux';
import Toast from 'react-native-simple-toast';
import SendMessage from '../../Services/Messaging';
import {errorMessages} from '../../Services/ErrorText';
import {MixPanelTrack} from '../../Services/MixPanel';
import {setSubscriptionModalVisible} from '../../store/Slice/registerSlice';

const Answer = ({txt, date, isLoading, messageHasMoreContent}) => {
  const dispatch = useDispatch();
  const remainingTokens = useSelector(
    state => state.register.deviceInfo.remaining_tokens,
  );

  const isSubscribed = useSelector(state => state.register.isSubscribed);

  const ReadMore = async () => {
    //console.log('read moreeee');
    try {
      MixPanelTrack('chat.readMore');

      if (!isSubscribed && remainingTokens < 0) {
        Toast.show(errorMessages.noTokens, Toast.LONG);
        dispatch(setSubscriptionModalVisible(true));

        return false;
      } else {
        return await SendMessage('Continue', false, true, false);
      }
    } catch (error) {
      //console.log('read more eroorrr');
    }
  };

  const CopyText = () => {
    MixPanelTrack('chat.copyText');

    Clipboard.setString(txt);
    Toast.show(errorMessages.textCopied, Toast.SHORT);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton />;
    } else {
      return <Text style={styles.msgTxt}>{txt}</Text>;
    }
  };

  return (
    <View style={styles.header}>
      <View
        style={{
          marginLeft: '3.45%',
          marginRight: '4.1%',
          maxWidth: '80%',
          minWidth: '80%',
        }}>
        <View style={styles.frame}>{renderContent()}</View>
        {!messageHasMoreContent && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <TouchableOpacity onPress={CopyText} style={styles.readBtn}>
                <Text
                  style={{
                    color: 'white',
                    color: '#6C727F',
                    fontSize: 10,
                    fontWeight: 400,
                    lineHeight: 16,
                  }}>
                  نسخ
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.date}>{formatDateToUUKK(date)}</Text>
          </View>
        )}

        {messageHasMoreContent && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <TouchableOpacity style={styles.readBtn} onPress={ReadMore}>
                <Text
                  style={{
                    color: 'white',
                    color: '#6C727F',
                    fontSize: 10,
                    fontWeight: 400,
                    lineHeight: 16,
                  }}>
                  اقرأ المزيد
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={CopyText} style={styles.readBtn}>
                <Text
                  style={{
                    color: 'white',
                    color: '#6C727F',
                    fontSize: 10,
                    fontWeight: 400,
                    lineHeight: 16,
                  }}>
                  نسخ
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.date}>{formatDateToUUKK(date)}</Text>
          </View>
        )}
      </View>
      <View style={styles.circleBox}>
        <Image
          style={styles.aiLogo}
          source={require('../../../assets/Group.png')}
        />
      </View>
    </View>
  );
};

export default Answer;

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
  },
  msgTxt: {
    color: '#FFFFFF',
    fontWeight: 500,
    fontSize: 13,
    lineHeight: 24,
    fontFamily: 'DroidArabicKufi',
    maxWidth: '100%',
  },
  circleBox: {
    width: 33,
    height: 33,
    borderRadius: 50,
    backgroundColor: '#076C38',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiLogo: {
    padding: 14.5,
  },
  frame: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 24,
    borderColor: '#003017',
    borderWidth: 1,
    alignItems: 'flex-start',
    padding: 16,
    minWidth: '90%',
  },
  date: {
    color: '#6C727F',
    marginTop: 5,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 16,
    fontFamily: 'DroidArabicKufi',
  },
  readBtn: {
    marginLeft: 20,
    marginTop: 2,
  },
});
