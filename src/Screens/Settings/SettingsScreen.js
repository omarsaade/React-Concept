import React from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import navigateTo from '../../Services/NavigateTo';
import {useSelector} from 'react-redux';
import {v4 as uuidv4} from 'uuid';
const SettingsScreen = () => {
  const pagesUrl = useSelector(state => state.register.pagesUrl);

  const renderedItems = pagesUrl.map((item, index) => (
    <React.Fragment key={uuidv4()}>
      <Pressable
        key={uuidv4()}
        onPress={() => navigateTo(item.url)}
        style={({pressed}) => [
          styles.pressableItem,
          pressed && styles.pressed,
        ]}>
        <Text style={styles.selections}>{item.title}</Text>
        <Image
          source={require('../../../assets/arrow-right.png')}
          style={{width: 15, height: 15, tintColor: '#FFFFFF', marginTop: 5}}
        />
      </Pressable>
      <View style={styles.divider} />
    </React.Fragment>
  ));

  return <View style={styles.container}>{renderedItems}</View>;
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111C13',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  pressableItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  selections: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'DroidArabicKufi-Bold',
  },
  pressed: {
    opacity: 0.2,
  },
  divider: {
    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
    paddingTop: 7,
    paddingBottom: 7,
  },
});