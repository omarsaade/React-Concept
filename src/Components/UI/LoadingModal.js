import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import ImageRotator from './ImageRotator';

const LoadingModal = () => (
  <Modal transparent visible={true}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ImageRotator w={85} h={85} c="green" flex={0} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
  },
});

export default LoadingModal;
