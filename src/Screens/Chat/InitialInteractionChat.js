import React from 'react';
import {View, StyleSheet, Image, Text, Dimensions} from 'react-native';
const {width} = Dimensions.get('window');

const InitialInteractionChat = () => {
  return (
    <View style={styles.header}>
      <View style={styles.frame}>
        <Text style={styles.msgTxt}>مرحبًا ، كيف يمكنني مساعدتك ؟</Text>
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

export default InitialInteractionChat;

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
    marginRight: width < 400 ? 12 : 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  msgTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 28,
    fontFamily: 'DroidArabicKufi',
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
    padding: 14,
  },
  frame: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 24,
    borderColor: '#003017',
    borderWidth: 1,
    alignItems: 'center',
    padding: 10,
    marginRight: 15,
    minWidth: '75%',
    maxWidth: '80%',
  },
});
