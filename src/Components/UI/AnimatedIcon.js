import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Image, Animated} from 'react-native';

const AnimatedIcon = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fadeInOut = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => fadeInOut());
    };

    const scaleInOut = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => scaleInOut());
    };

    fadeInOut();
    scaleInOut();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageContainer,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
        ]}>
        <Image source={require('../../../assets/Chat.png')} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 62.5,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimatedIcon;
