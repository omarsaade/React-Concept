import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text, Image} from 'react-native';
import {TOPICS_URL} from '../../Services/Api';
import IconButton from '../../Components/UI/IconButton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../../Services/Global';
const {width} = Dimensions.get('window');

const Topics = ({navigation}) => {
  const [topicsList, setTopicsList] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const storedApiKey = await AsyncStorage.getItem('api_key');

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      setTimeout(() => {
        source.cancel();
      }, global.timeOut);
      const response = await axios.get(TOPICS_URL, {
        headers: {
          'api-key': storedApiKey,
          'Content-Type': 'application/json',
        },

        cancelToken: source.token,
      });

      if (response.status === 200) {
        const json = response.data;
        setTopicsList(json.data);
      } else {
        console.error('Error: ' + response.status);
      }
    } catch (error) {
      setTimeout(() => {
        fetchTopics();
      }, 3000);
      console.error('Error: ' + error);
    }
  };

  const NavigationButton = item => {
    navigation.navigate('Story', {code: item});
  };

  const renderMap = () => {
    return topicsList.map(item => (
      <View style={styles.item} key={item.id}>
        <IconButton onPress={() => NavigationButton(item)}>
          <Image source={{uri: item.icon}} style={styles.bottomIcon} />
          <View style={{width: 200}}>
            <Text numberOfLines={1} style={styles.topicText}>
              {item.title}
            </Text>
          </View>
        </IconButton>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.columnWrapper}>{renderMap()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },
  columnWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  item: {
    borderColor: '#076c38c9',
    borderRadius: 20,
    borderWidth: 0.5,
    padding: '5.5%',
    marginVertical: 12,
    marginHorizontal: 10,
    width: width / 2 - 32,
    alignItems: 'center',
    elevation: 10,
    backgroundColor: '#111C13',
  },
  bottomIcon: {
    resizeMode: 'contain',
    width: 34,
    height: 35,
    tintColor: '#076C38',
  },
  topicText: {
    flex: 1,
    fontFamily: 'DroidArabicKufi',
    fontSize: 12,
    lineHeight: 22,
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 20,
  },
});

export default Topics;
