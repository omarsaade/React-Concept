import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import SubscriptionsOptions from './SubscriptionsOptions';
import ImageRotator from '../UI/ImageRotator';
import Content from './Contents';
import {useSelector} from 'react-redux';
import {purchasePackage} from '../../Services/ConfigurePurchases';
import {FrequentPopup} from '../../Services/GlobalFn';
import {MixPanelTrack} from '../../Services/MixPanel';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setSubscriptionModalVisible} from '../../store/Slice/registerSlice';

const Footer = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const subscriptionOffers = useSelector(
    state => state.register.subscriptionOffers,
  );
  const selectedOffer = useSelector(state => state.register.selectedOffer);
  const purchaseInProcess = useSelector(
    state => state.register.purchaseInProcess,
  );
  const subscribeBtnText = useSelector(
    state => state.register.subscribeBtnText,
  );
  const isSubscribed = useSelector(state => state.register.isSubscribed);
  const isFreeTrialSelected = useSelector(
    state => state.register.isFreeTrialSelected,
  );

  const ContinueBtn = async () => {
    MixPanelTrack('purchases.continue');
    if (!selectedOffer) {
      await FrequentPopup();
      return false;
    }
    if (purchaseInProcess) {
      return false;
    }
    const res = await purchasePackage(selectedOffer);

    if (isSubscribed) {
      return false;
    }
  };

  const WatchAdsBtn = () => {
    dispatch(setSubscriptionModalVisible(false));
    navigation.navigate('AdMob');
  };

  return (
    <View style={{flex: 1, marginBottom: 30}}>
      {subscriptionOffers.length === 0 ? (
        <View style={{marginTop: 20, minHeight: 180}}>
          <ImageRotator />
          <Text style={styles.paymentText}>انتظر من فضلك...</Text>
        </View>
      ) : (
        <Content subscriptionOffers={subscriptionOffers} />
      )}
      {subscriptionOffers.length !== 0 && (
        <TouchableOpacity
          style={
            !isFreeTrialSelected
              ? styles.continueOptionNotchecked
              : styles.continueOption
          }
          onPress={ContinueBtn}
          disabled={!isFreeTrialSelected}>
          {purchaseInProcess ? (
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Text style={styles.continueText}>الرجاء الانتظار</Text>
              <ImageRotator w={25} h={25} c="white" flex={0} />
            </View>
          ) : (
            <Text style={styles.continueText}>{subscribeBtnText}</Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.continueWatchingAdsBtn}
        onPress={WatchAdsBtn}>
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Text style={styles.continueWatchingAdsText}>
            شاهد إعلانًا للحصول على رصيد
          </Text>
        </View>
      </TouchableOpacity>

      {/* here */}
      <SubscriptionsOptions />
      <View
        style={{
          marginHorizontal: 20,
          marginTop: 20,
          display: 'none',
          flexDirection: 'column',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 9,
            color: '#424242',
            lineHeight: 17,
            fontFamily: 'DroidArabicKufi',
          }}>
          ستبدأ النسخة التجريبية المجانية لديك لمدة 3 أيام ، ثم سيتم تحصيل 7.99
          دولار أمريكي منك على أساس أسبوعي. وفقًا لشروط استخدام متجر iTunes التي
          نوصيك بمراجعتها قبل الشروع في أي معاملة عبر الإنترنت: سيتم تحصيل الدفع
          من حسابك في iTunes عند تأكيد الشراء. سيتم تجديد اشتراكك في خدماتنا
          المتميزة أو المنتجات داخل التطبيق تلقائيًا لنفس الاشتراك وبنفس السعر
          الذي اشتركت فيه في البداية إلا إذا ألغيت اشتراكك عن طريق إيقاف التجديد
          التلقائي قبل 24 ساعة على الأقل من انتهاء الفترة الحالية. سيتم تحصيل
          رسوم التجديد من حسابك بنفس السعر الذي اشتركت فيه في غضون 24 ساعة قبل
          نهاية الفترة الحالية. يمكنك إدارة الاشتراكات وإيقاف التجديد التلقائي
          عن طريق الانتقال إلى إعدادات الحساب في قسم iTunes & App store من
          إعدادات جهازك. سيتم التنازل عن أي جزء غير مستخدم من الفترة التجريبية
          المجانية، إذا تم تقديمها، عندما يشتري المستخدم اشتراكًا، حيث ينطبق
          الأمر.
        </Text>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  continueOption: {
    backgroundColor: '#076C38',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 24,
    borderRadius: 56,
    borderColor: '#193d1d',
    marginHorizontal: 20,
    marginTop: 25,
  },
  continueText: {
    color: '#FFFFFF',
    lineHeight: 22,
    fontFamily: 'DroidArabicKufi',
    fontSize: 14,
  },
  paymentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 56,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  paymentText: {
    color: '#FFFFFF',
    lineHeight: 24,
    fontFamily: 'DroidArabicKufi',
    fontSize: 12,
    textAlign: 'center',
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 4,
  },

  txtInfo: {
    fontFamily: 'DroidArabicKufi',
    fontSize: 12,
    color: '#2F5034',
    lineHeight: 24,
    fontWeight: 500,
  },
  continueWatchingAdsBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginHorizontal: 20,
    marginTop: 15,
  },
  continueWatchingAdsText: {
    fontFamily: 'DroidArabicKufi',
    fontSize: 11,
    color: '#2F5034',
    lineHeight: 25,
  },
  continueOptionNotchecked: {
    backgroundColor: '#2F5034',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 24,
    borderRadius: 56,
    borderColor: '#193d1d',
    marginHorizontal: 20,
    marginTop: 25,
  },
});
