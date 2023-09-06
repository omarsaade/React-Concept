import React from 'react';
import {View, StyleSheet, TextInput, Image} from 'react-native';

const ConversationInput = ({isKeyboardOpen}) => {
  return (
    <View style={[styles.container, {paddingBottom: isKeyboardOpen ? 30 : 0}]}>
      <View style={styles.textInput}>
        <TextInput
          style={styles.input}
          placeholder="اكتب رد ..."
          placeholderTextColor="gray"
          multiline={true}
          numberOfLines={2}
        />
        <Image
          source={require('../../../assets/compass.png')}
          style={{width: 26, height: 26, padding: 10, marginRight: 30}}
        />
      </View>
    </View>
  );
};

export default ConversationInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    paddingLeft: 30,
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'DroidArabicKufi',
    color: 'white',
  },
  textInput: {
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#233f31',
    height: 54,
    borderRadius: 60,
    width: 327,
  },
});
