import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import formatDateToUUKK from '../../Services/FormattedDate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {ResendMessage} from '../../Services/Messaging';
import Toast from 'react-native-simple-toast';
import {errorMessages} from '../../Services/ErrorText';
import {MixPanelTrack} from '../../Services/MixPanel';

const Question = ({txt, date, isSent}) => {
  const isSubscribed = useSelector(state => state.register.isSubscribed);
  const firstMessage = useSelector(state => state.register.firstMessage);
  const remainingTokens = useSelector(
    state => state.register.deviceInfo.remaining_tokens,
  );

  const Resendhandler = async () => {
    try {
      MixPanelTrack('chat.resendMessage');
      await AsyncStorage.setItem('sentMsg', txt);
      if (!isSubscribed && remainingTokens < 0) {
        Toast.show(errorMessages.noTokens, Toast.LONG);
        return;
      } else {
        ResendMessage(txt, firstMessage);
      }
    } catch (error) {
      //console.log('error from Question.js');
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.parentContainer}>
        <View style={styles.frame}>
          <Text style={styles.msgTxt}>{txt}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formatDateToUUKK(date)}</Text>
        </View>
      </View>
      {isSent ? null : (
        <View style={{marginLeft: '3%', marginTop: 15}}>
          <TouchableOpacity onPress={Resendhandler}>
            <Image
              source={require('../../../assets/Reloadd.png')}
              style={{tintColor: '#076C38', width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Question;

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
    marginLeft: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  msgTxt: {
    color: '#FFFFFF',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'DroidArabicKufi',
    maxWidth: '100%',
  },
  frame: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 4,
    borderColor: '#003017',
    borderWidth: 1,
    alignItems: 'flex-start',
    padding: 14.5,
    backgroundColor: '#076C38',
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
  parentContainer: {
    maxWidth: '85%',
    minWidth: '80%',
  },
  dateContainer: {display: 'flex', alignItems: 'flex-end'},
});
