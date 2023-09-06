import {Platform} from 'react-native';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import mobileAds from 'react-native-google-mobile-ads';
import {store} from '../store/Index/store';
import {
  setIsSubscribed,
  setSubscriptionOffers,
  setPurchaseInProcess,
  setSubscriptionInfo,
  setSubscriptionInitialized,
  setIsFreeTrialSelected,
} from '../store/Slice/registerSlice';
import {errorMessages} from './ErrorText';
import {registerDevice} from './registerDevice';
import {MixPanelTrack} from './MixPanel';

export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    //console.warn('offering: ', offerings.current.availablePackages);
    if (
      offerings.current !== null &&
      offerings.current.availablePackages.length !== 0
    ) {
      store.dispatch(
        setSubscriptionOffers(offerings.current.availablePackages),
      );
    }
  } catch (e) {
    const test_packages = [
      {
        identifier: '$rc_weekly',
        offeringIdentifier: 'pro',
        packageType: 'WEEKLY',
        product: {
          currencyCode: 'USD',
          defaultOption: [Object],
          description: 'ثم 7.99 دولار أمريكي أسبوعيا',
          discounts: null,
          identifier: 'pro_subscription:weeklypro',
          introPrice: [Object],
          presentedOfferingIdentifier: 'pro',
          price: 7.99,
          priceString: '$7.99',
          productCategory: 'SUBSCRIPTION',
          productType: 'AUTO_RENEWABLE_SUBSCRIPTION',
          subscriptionOptions: [Array],
          subscriptionPeriod: 'P1W',
          title: '3 أيام مجانية (AI Arabia GPT Assistant)',
        },
      },
      {
        identifier: '$rc_monthly',
        offeringIdentifier: 'pro',
        packageType: 'MONTHLY',
        product: {
          currencyCode: 'USD',
          defaultOption: [Object],
          description: 'شهريا 24.99 دولار أمريكي',
          discounts: null,
          identifier: 'monthlypro:monthlypro',
          introPrice: null,
          presentedOfferingIdentifier: 'pro',
          price: 24.99,
          priceString: '$24.99',
          productCategory: 'SUBSCRIPTION',
          productType: 'AUTO_RENEWABLE_SUBSCRIPTION',
          subscriptionOptions: [Array],
          subscriptionPeriod: 'P1M',
          title: 'إشتراك دخول شهري (AI Arabia GPT Assistant)',
        },
      },
      {
        identifier: '$rc_annual',
        offeringIdentifier: 'pro',
        packageType: 'ANNUAL',
        product: {
          currencyCode: 'USD',
          defaultOption: [Object],
          description: 'سنويا 49.99 دولار أمريكي ',
          discounts: null,
          identifier: 'yearlypro:yearlypro',
          introPrice: [Object],
          presentedOfferingIdentifier: 'pro',
          price: 49.99,
          priceString: '$49.99',
          productCategory: 'SUBSCRIPTION',
          productType: 'AUTO_RENEWABLE_SUBSCRIPTION',
          subscriptionOptions: [Array],
          subscriptionPeriod: 'P1Y',
          title: 'إشتراك دخول سنوي (AI Arabia GPT Assistant)',
        },
      },
    ];

    store.dispatch(setSubscriptionOffers(test_packages));
    //console.log('error getting offer', JSON.stringify(e));
  }
};

export const configurePurchases = async () => {
  //  مشتريات تمت تهيئتها
  let purchasesInitialized = await AsyncStorage.getItem('purchasesInitialized');
  if (purchasesInitialized) {
    await getSubscriptionInfo();
    return;
  }

  await AsyncStorage.setItem('purchasesInitialized', 'true');

  MixPanelTrack('purchases.configurePurechases');
  let deviceInfo = await AsyncStorage.getItem('DeviceInfo');
  deviceInfo = JSON.parse(deviceInfo);
  const revenue_cat_user_id = deviceInfo.revenue_cat_user_id;
  ////console.log('api_key:', revenue_cat_user_id);
  let purchasesKey = '';

  if (Platform.OS === 'ios') {
    purchasesKey = await AsyncStorage.getItem('revenue_cat_ios_key');
  } else if (Platform.OS === 'android') {
    purchasesKey = await AsyncStorage.getItem('revenue_cat_android_key');
  }

  if (!purchasesKey) {
    //console.log('Purchases key not found in AsyncStorage');
    return;
  }

  Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  Purchases.configure({
    apiKey: purchasesKey,
    appUserID: revenue_cat_user_id,
    observerMode: false,
    useAmazon: false,
  });

  getSubscriptionInfo();
};

// export const getSubscriptionInfo = async () => {
//   Purchases.getCustomerInfo().then(purchaserInfo => {
//     if (purchaserInfo.activeSubscriptions.length) {
//       store.dispatch(setIsSubscribed(true));
//       store.dispatch(setSubscriptionInfo(purchaserInfo));
//     } else {
//       store.dispatch(setIsSubscribed(false));
//       store.dispatch(setSubscriptionInfo([]));
//     }
//     store.dispatch(setSubscriptionInitialized(true));
//   });
// };

export const getSubscriptionInfo = async () => {
  Purchases.getCustomerInfo().then(purchaserInfo => {
    let isSubscribed = false;
    let subscriptionInfo = [];
    ////console.log('subscriptionInfo', purchaserInfo);

    if (
      purchaserInfo.activeSubscriptions.length &&
      purchaserInfo.entitlements?.active
    ) {
      isSubscribed = true;
      subscriptionInfo = purchaserInfo;
    }
    store.dispatch(setIsSubscribed(isSubscribed));
    store.dispatch(setSubscriptionInfo(subscriptionInfo));

    store.dispatch(setSubscriptionInitialized(true));
  });
};

export const restorePurchases = async () => {
  const res = await Purchases.restorePurchases();
  //console.warn('restoration: ', res);
  await getSubscriptionInfo();
};

export const configureAds = async () => {
  mobileAds()
    .initialize()
    .then(adapterStatuses => {
      ////console.log('Ads initialized');
    });
};

export const purchasePackage = async item => {
  try {
    MixPanelTrack('purchases.purchase');
    //console.log('purchase started');
    store.dispatch(setPurchaseInProcess(true));

    //console.log('selected product 1: ', item.product);
    //const eligible =  await Purchases.checkTrialOrIntroductoryPriceEligibility(item.identifier);
    ////console.warn("eligible", eligible);
    //return;

    const {purchaserInfo} = await Purchases.purchasePackage(item);
    //console.warn('purchase info:', purchaserInfo);

    if (purchaserInfo) {
      if (purchaserInfo.customerInfo.entitlements.active['pro']) {
        //console.log('purchase success');

        return true;
      } else {
        //console.log('purchase not completed');

        //store.dispatch(setIsFreeTrialSelected(false));

        return false;
      }
    } else {
      console.error('Purchase error');
      //store.dispatch(setIsFreeTrialSelected(false));

      return false;
    }
  } catch (e) {
    //console.log('purchase error');
    store.dispatch(setPurchaseInProcess(false));
    //store.dispatch(setIsFreeTrialSelected(false));

    if (!e.userCancelled) {
      //store.dispatch(setIsFreeTrialSelected(false));

      //console.warn('Error purchasing package', e.message);
      Toast.show(errorMessages.errorPurchasingPackage, Toast.LONG);

      return false;
    }
  } finally {
    await registerDevice();
    store.dispatch(setPurchaseInProcess(false));
  }
};
