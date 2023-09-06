import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import navigateTo from '../../Services/NavigateTo';
import {v4 as uuidv4} from 'uuid';

const SubscriptionsOptions = () => {
  const pagesUrl = useSelector(state => state.register.pagesUrl);

  const renderedItems = pagesUrl.map((item, index) => (
    <Pressable key={uuidv4()} onPress={() => navigateTo(item.url)}>
      <Text style={styles.txtInfo}>{item.title}</Text>
    </Pressable>
  ));

  return <View style={styles.info}>{renderedItems}</View>;
};

export default SubscriptionsOptions;

const styles = StyleSheet.create({
  info: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
  },

  txtInfo: {
    fontFamily: 'DroidArabicKufi',
    fontSize: 11,
    color: '#2F5034',
    lineHeight: 25,
  },
});
