import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

const ImageRotator = ({w = 70, h = 70, c = 'green', flex = 1}) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    );
    rotateAnimation.start();

    return () => {
      rotateAnimation.stop();
    };
  }, [rotateValue]);

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.loadingContainer, {flex: flex}]}>
      <Animated.Image
        source={require('../../../assets/loading.png')}
        style={[
          {
            width: w,
            height: h,
            tintColor: c,
          },
          {transform: [{rotate: spin}]},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImageRotator;
