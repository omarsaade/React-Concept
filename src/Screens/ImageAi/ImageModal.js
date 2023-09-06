import React, {Fragment, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Clipboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setAIDisplayed} from '../../store/Slice/registerSlice';
import RNFS from 'react-native-fs';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import LoadingModal from '../../Components/UI/LoadingModal';
import Toast from 'react-native-simple-toast';
import {errorMessages} from '../../Services/ErrorText';

const ImageModal = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isAIDisplayed = useSelector(state => state.register.isAIDisplayed);
  const aiImageUrl = useSelector(state => state.register.aiImageUrl);

  //console.log('aiImageUrl...', aiImageUrl);

  const closeImageModal = () => {
    dispatch(setAIDisplayed(false));
  };

  const copyText = () => {
    Clipboard.setString(aiImageUrl);
    Toast.show('تم نسخ الرابط', Toast.LONG);
  };

  const downloadImage = () => {
    const fileName = aiImageUrl.split('/').pop();
    const destinationPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    setLoading(true);
    RNFS.downloadFile({
      fromUrl: aiImageUrl,
      toFile: destinationPath,
    })
      .promise.then(res => {
        //console.log('Image downloaded successfully.');

        CameraRoll.save(destinationPath)
          .then(uri => {
            //console.log('Image saved to gallery:', uri);
            Toast.show(errorMessages.imageSavedToGallery, Toast.LONG);

            setLoading(false);
          })
          .catch(error => {
            Toast.show(errorMessages.errorWhileSavingImage, Toast.LONG);

            //console.log('Error while saving image to gallery:', error);
            setLoading(false);
          });
      })
      .catch(err => {
        Toast.show(errorMessages.errorWhileDownloading, Toast.LONG);

        //console.log('Error while downloading the image:', err);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      {isAIDisplayed && (
        <Modal
          transparent={true}
          visible={isAIDisplayed}
          onRequestClose={closeImageModal}>
          <View style={styles.modalContainer}>
            {loading && <LoadingModal />}

            <Image
              source={{uri: aiImageUrl}}
              style={styles.modalImage}
              resizeMode="contain"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 50,
              }}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={downloadImage}>
                <Text style={styles.modalButtonText}>حفظ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeImageModal}>
                <Text style={styles.modalButtonText}>إغلاق</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={copyText}>
                <Text style={styles.modalButtonText}>نسخ الرابط</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.93)',
  },
  modalImage: {
    width: '90%',
    height: 300,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#182e23',
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 26,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: 'white',
    fontFamily: 'DroidArabicKufi',
    fontSize: 9,
  },
});

export default ImageModal;
