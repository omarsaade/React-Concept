import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const Skeleton = () => {
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      speed={500}
      highlightColor="#ffffff"
      backgroundColor="#dadada">
      <View style={styles.container}>
        <SkeletonPlaceholder.Item style={styles.item}>
          <SkeletonPlaceholder.Item width={200} height={10} opacity={0.5} />
          <SkeletonPlaceholder.Item
            marginTop={6}
            width={150}
            height={10}
            style={styles.startFromRight}
          />
        </SkeletonPlaceholder.Item>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  item: {
    marginLeft: 20,
  },
  startFromRight: {
    marginLeft: 'auto',
    opacity: 0.5,
  },
});

export default Skeleton;
