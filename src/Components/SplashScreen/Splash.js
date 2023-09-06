import React, {useEffect, useRef, useState} from 'react';
import ProgressBar from 'react-native-progress/Bar';
import {View, Animated, Easing, Dimensions, Text} from 'react-native';

const Splash = () => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const [value, setValue] = useState(0);

  function animateValue(callback) {
    const duration = 900;
    const interval = 10;
    const steps = duration / interval;
    let currentValue = 0;
    let stepCount = 0;

    function updateValue() {
      stepCount++;
      currentValue = stepCount / steps;

      if (currentValue >= 1) {
        clearInterval(intervalId);
      }

      callback(currentValue);
    }

    const intervalId = setInterval(updateValue, interval);
  }

  useEffect(() => {
    animateValue(currentValue => {
      setValue(currentValue);
    });
  }, []);

  useEffect(() => {
    const {width, height} = Dimensions.get('window');
    const targetSize = Math.sqrt(width * width + height * height);

    const animation = Animated.timing(scaleValue, {
      toValue: targetSize / 720,
      duration: 900,
      easing: Easing.ease,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#111C13',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#111C13',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 10,
        }}>
        <Animated.Image
          source={require('../../../assets/Ai.png')}
          style={{
            width: 300,
            height: 300,
            transform: [{scale: scaleValue}],
          }}
        />
        <View
          style={{
            marginTop: 100,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#FFF',
              fontSize: 18,
              fontFamily: 'DroidArabicKufi',
            }}>
            تحميل
          </Text>
          <View style={{marginTop: 25}}>
            <ProgressBar
              progress={value}
              width={300}
              color="#076C38"
              unfilledColor="#112814"
              borderWidth={1}
              borderColor="#112814"
              indeterminateAnimationDuration={1000}
              height={3}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Splash;
