import 'react-native-gesture-handler';
import React from 'react';
import {
  Pressable,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabNav from './BottomTabNav';
import DiamondImg from '../../assets/diamond.png';
import comboShapeImg from '../../assets/comboShape.png';
import navigateTo from '../Services/NavigateTo';
import {useSelector, useDispatch} from 'react-redux';
import {setSubscriptionModalVisible} from '../store/Slice/registerSlice';
import {MixPanelTrack} from '../Services/MixPanel';
import {useNavigation} from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const PremiumScreen = () => (
  <View style={styles.container}>
    <Text>Premium Screen</Text>
  </View>
);

const ChatAssistantScreen = () => (
  <View style={styles.container}>
    <Text>Chat Assistant Screen</Text>
  </View>
);

const BalanceScreen = () => (
  <View style={styles.container}>
    <Text>Balance Screen</Text>
  </View>
);

const AdsScreen = () => (
  <View style={styles.container}>
    <Text>Watch an ADS for credit Screen</Text>
  </View>
);

const DrawerContent = ({navigation}) => {
  const dispatch = useDispatch();

  const remainingTokens = useSelector(
    state => state.register.deviceInfo.remaining_tokens,
  );
  const isSubscribed = useSelector(state => state.register.isSubscribed);
  const {
    tiktok_url,
    instagram_url,
    facebook_url,
    twitter_url,
    snapchat_url,
    youtube_url,
    enable_admob_test_mode,
    tokens_per_ad,
  } = useSelector(state => state.register.settings);

  const handlePress = async () => {
    MixPanelTrack('purchases.openSubscription');

    if (!isSubscribed) {
      dispatch(setSubscriptionModalVisible(true));
    } else {
      navigation.navigate('SubscriptionDetails');
      dispatch(setSubscriptionModalVisible(false));
    }
  };

  return (
    <View style={styles.drawerContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>القائمة</Text>
      </View>
      <View style={styles.sectionHeader}>
        <OptionItem
          title="الدفع"
          img={require('../../assets/diamondtwo.png')}
          onPress={handlePress}
        />
        <OptionItem
          wallet={isSubscribed ? 'غير محدود' : remainingTokens}
          title="الرصيد"
          img={require('../../assets/wallet.png')}
        />
        {!isSubscribed && !Boolean(enable_admob_test_mode) && (
          <OptionItem
            title="شاهد إعلانًا للحصول على رصيد"
            img={require('../../assets/donate.png')}
            onPress={() => navigation.navigate('AdMob')}
          />
        )}
        {!isSubscribed && !Boolean(enable_admob_test_mode) && (
          <Text
            style={{
              marginTop: -10,
              marginLeft: 30,
              color: '#076C38',
              fontSize: 8,
              fontFamily: 'DroidArabicKufi',
            }}>
            عند مشاهدتك للإعلان ستحصل على {tokens_per_ad} نقطة
          </Text>
        )}
      </View>
      <View style={styles.section}>
        <View
          style={{
            width: '100%',
            direction: 'rtl',
            flexDirection: 'row',
            paddingLeft: 10,
          }}>
          <Text style={styles.sectionTitle}>تابعونا</Text>
        </View>
        <View style={styles.row}>
          {instagram_url && (
            <Pressable onPress={() => navigateTo(instagram_url)}>
              <Image
                source={require('../../assets/instagram.png')}
                style={styles.icon}
              />
            </Pressable>
          )}
          {facebook_url && (
            <Pressable onPress={() => navigateTo(facebook_url)}>
              <Image
                source={require('../../assets/facebook.png')}
                style={styles.icon}
              />
            </Pressable>
          )}
          {tiktok_url && (
            <Pressable onPress={() => navigateTo(tiktok_url)}>
              <Image
                source={require('../../assets/tiktok.png')}
                style={styles.icon}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.row}>
          {twitter_url && (
            <Pressable onPress={() => navigateTo(twitter_url)}>
              <Image
                source={require('../../assets/twitter.png')}
                style={styles.icon}
              />
            </Pressable>
          )}
          {youtube_url && (
            <Pressable onPress={() => navigateTo(youtube_url)}>
              <Image
                source={require('../../assets/youtube.png')}
                style={styles.icon}
              />
            </Pressable>
          )}
          {snapchat_url && (
            <Pressable onPress={() => navigateTo(snapchat_url)}>
              <Image
                source={require('../../assets/snapchat.png')}
                style={styles.icon}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const OptionItem = ({title, img, onPress, wallet}) => (
  <Pressable style={styles.optionItem} onPress={onPress}>
    <Image source={img} resizeMode="stretch" style={styles.optionIcon} />
    <Text style={styles.optionText}>{title}</Text>
    <Text
      style={{
        paddingRight: '30%',
        paddingLeft: 10,
        paddingTop: 2,
        color: '#076C38',
      }}>
      {wallet}
    </Text>
  </Pressable>
);

const DrawNav = () => {
  const isSubscribed = useSelector(state => state.register.isSubscribed);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePress = async () => {
    MixPanelTrack('purchases.openSubscription');

    if (!isSubscribed) {
      dispatch(setSubscriptionModalVisible(true));
    } else {
      navigation.navigate('SubscriptionDetails');
      dispatch(setSubscriptionModalVisible(false));
    }
  };

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="initial"
      screenOptions={({navigation}) => ({
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        drawerType: 'slide',
        drawerPosition: 'right',
        headerStyle: {
          backgroundColor: '#111C13',
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{marginLeft: 15, padding: 5}}>
            <Image source={comboShapeImg} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={{display: 'flex', flexDirection: 'row'}}>
            {!isSubscribed && (
              <TouchableOpacity style={{marginRight: 15}} onPress={handlePress}>
                <Image source={DiamondImg} style={{tintColor: 'green'}} />
              </TouchableOpacity>
            )}
          </View>
        ),
        headerTitle: '',
      })}>
      <Drawer.Screen name="initial" component={BottomTabNav} />
      <Drawer.Screen name="Premium" component={PremiumScreen} />
      <Drawer.Screen name="ChatAssistant" component={ChatAssistantScreen} />
      <Drawer.Screen name="Balance" component={BalanceScreen} />
      <Drawer.Screen name="Ads" component={AdsScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#040A04',
  },
  header: {
    backgroundColor: '#076C38',
    paddingVertical: 5,
    marginBottom: 13,
    width: '100%',
    direction: 'rtl',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'DroidArabicKufi',
    color: '#FFFFFF',
    lineHeight: 24,
    paddingTop: 56,
    paddingBottom: 20,
  },
  section: {
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    lineHeight: 30.2,
    color: '#FFFFFF',
    marginBottom: 26,
    fontFamily: 'DroidArabicKufi',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 20,
  },
  optionIcon: {
    marginRight: 10,
    width: 25,
    height: 25,
  },
  optionText: {
    fontSize: 13,
    color: '#FFFFFF',
    paddingLeft: 4,
    lineHeight: 25,
    fontFamily: 'DroidArabicKufi',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    marginBottom: 16,
    paddingLeft: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  icon: {
    marginRight: 52,
    tintColor: '#5E6272',
    marginBottom: 15,
  },
});

export default DrawNav;
