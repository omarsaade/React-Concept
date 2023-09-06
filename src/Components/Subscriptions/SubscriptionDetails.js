import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getSubscriptionInfo} from '../../Services/ConfigurePurchases';
import {setPurchaseInProcess} from '../../store/Slice/registerSlice';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Purchases from 'react-native-purchases';

const SubscriptionDetails = ({navigation}) => {
  const dispatch = useDispatch();
  const subscriptionInfo = useSelector(
    state => state.register.subscriptionInfo,
  );

  useEffect(() => {
    dispatch(setPurchaseInProcess(false));
    getSubscriptionInfo();
  }, []);

  useEffect(() => {
    if (!subscriptionInfo) {
      navigation.goBack();
    }
  }, [subscriptionInfo]);

  useEffect(() => {
    // Subscribe to purchaser updates
    Purchases.addCustomerInfoUpdateListener(getSubscriptionInfo);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(getSubscriptionInfo);
    };
  });

  let expiresDate,
    dateObj,
    time,
    date,
    purchaseDate,
    purchaseDateObj,
    purTime,
    purDate,
    productIdentifier;

  const isEntitlementsEmpty =
    !subscriptionInfo?.activeSubscriptions?.length ||
    !subscriptionInfo.entitlements?.active;

  const entitlements = subscriptionInfo.entitlements;
  //console.log('sub info active', entitlements);

  if (!isEntitlementsEmpty) {
    // //console.log('sub info active', entitlements.active.pro);
    expiresDate = entitlements.active.pro.expirationDate;
    dateObj = new Date(expiresDate);
    time = dateObj.toLocaleTimeString('en-US');
    date = dateObj.toLocaleDateString('en-US');

    purchaseDate = entitlements.active.pro.latestPurchaseDate;
    purchaseDateObj = new Date(purchaseDate);

    purTime = purchaseDateObj.toLocaleTimeString('en-US');
    purDate = purchaseDateObj.toLocaleDateString('en-US');

    productIdentifier = entitlements.active.pro.productIdentifier;
  }

  return (
    <View style={styles.container}>
      {isEntitlementsEmpty ? (
        <View style={styles.ShiledCheck}>
          <Text style={styles.BigTitle}>الإشتراك منتهي الصلاحية</Text>
          <Image
            source={require('../../../assets/remove-circle.png')}
            style={{tintColor: '#8B0000'}}
          />
        </View>
      ) : (
        <View style={styles.ShiledCheck}>
          <Text style={styles.title}>أنت مشترك</Text>
          <Image source={require('../../../assets/shield-check.png')} />
        </View>
      )}
      {!isEntitlementsEmpty && (
        <View
          style={{
            flex: 0.6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Grid>
            <Col size={25}>
              <Row style={styles.cell}>
                <Text style={styles.innerText}>معرّف المنتج:</Text>
              </Row>
              <Row style={styles.cell}>
                <Text style={styles.innerText}>تاريخ الاشتراك:</Text>
              </Row>
              <Row style={styles.cell}>
                <Text style={styles.innerText}>وقت الاشتراك:</Text>
              </Row>
              <Row style={styles.cell}>
                <Text style={styles.innerText}>تاريخ انتهاء الاشتراك:</Text>
              </Row>
              <Row style={styles.cell}>
                <Text style={styles.innerText}>وقت انتهاء الاشتراك:</Text>
              </Row>
            </Col>
            <Col size={25}>
              <Row style={styles.cell}>
                <Text style={styles.innerText}>{productIdentifier}</Text>
              </Row>
              <Row style={styles.cell}>
                <Text style={styles.innerText}>{purDate}</Text>
              </Row>
              <Row style={styles.cell}>
                <Text style={styles.innerText}>{purTime}</Text>
              </Row>
              <Row style={styles.cell}>
                <Text style={styles.innerText}>{date}</Text>
              </Row>
              <Row style={styles.cell}>
                <Text style={styles.innerText}>{time}</Text>
              </Row>
            </Col>
          </Grid>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#111C13',
  },
  cell: {
    borderWidth: 1,
    borderColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerText: {
    fontFamily: 'DroidArabicKufi',
    fontSize: 14,
    color: 'white',
  },
  title: {
    fontSize: 22,
    fontFamily: 'DroidArabicKufi',
    textAlign: 'center',
    color: 'white',
    paddingLeft: 7,
  },
  BigTitle: {
    fontSize: 19,
    fontFamily: 'DroidArabicKufi',
    textAlign: 'center',
    color: 'white',
    paddingLeft: 10,
    paddingRight: 10,
  },
  continueText: {
    color: 'white',
    lineHeight: 22,
    fontFamily: 'DroidArabicKufi',
    fontSize: 14,
    textAlign: 'center',
  },
  ShiledCheck: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  valueText: {
    color: 'white',
    fontFamily: 'DroidArabicKufi',
    fontSize: 12,
  },
});

export default SubscriptionDetails;
