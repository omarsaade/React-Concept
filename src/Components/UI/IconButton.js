import React from 'react';
import {Pressable, StyleSheet} from 'react-native';

const IconButton = ({onPress, children}) => {
  return (
    <Pressable onPress={onPress} style={styles.topicBtn}>
      {children}
    </Pressable>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  topicBtn: {
    flex: 1,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
