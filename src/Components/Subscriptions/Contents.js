import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Platform,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {
  setSelectedOffer,
  setIsFreeTrialSelected,
  setSubscribeBtnText,
} from '../../store/Slice/registerSlice';
import {useDispatch} from 'react-redux';

const Content = ({subscriptionOffers}) => {
  const dispatch = useDispatch();
  const [selectedIdentifier, setSelectedIdentifier] = useState(null);
  const [trialEnabled, setTrialEnabled] = useState(false);

  const handleCheckedChange = (pkg, identifier) => {
    dispatch(setIsFreeTrialSelected(true));
    if (!pkg) {
      return false;
    }

    if (pkg.product.introPrice) {
      dispatch(setSubscribeBtnText('الإستمرار مجاناً'));
      setTrialEnabled(true);
    } else {
      dispatch(setSubscribeBtnText('الإستمرار'));
      setTrialEnabled(false);
    }

    dispatch(setSelectedOffer(pkg));
    setSelectedIdentifier(identifier);
  };

  useEffect(() => {
    if (subscriptionOffers.length) {
      handleCheckedChange(
        subscriptionOffers[0],
        subscriptionOffers[0].product?.identifier,
      );
    }
  }, [subscriptionOffers]);

  return (
    <View style={{marginTop: 20}}>
      <Pressable
        style={styles.container}
        onPress={() => handleCheckedChange(null, null)}>
        <View style={styles.secondOption}>
          {trialEnabled ? (
            <View style={{minWidth: '50%', maxWidth: '80%'}}>
              <Text style={[styles.optionText, styles.whiteText]}>
                تم تفعيل النسخة التجريبية المجانية
              </Text>
            </View>
          ) : (
            <View style={{minWidth: '50%', maxWidth: '80%'}}>
              <Text style={[styles.optionText, styles.whiteText]}>
                النسخة التجريبية المجانية
              </Text>
            </View>
          )}

          <View>
            <Switch
              style={styles.switch}
              trackColor={{false: '#767577', true: '#076C38'}}
              thumbColor={!trialEnabled ? 'white' : 'white'}
              ios_backgroundColor="#3e3e3e"
              value={trialEnabled}
            />
          </View>
        </View>
      </Pressable>

      {subscriptionOffers.map((option, index) => {
        const {title, description, identifier} = option.product;
        return (
          <Pressable
            style={styles.container}
            key={index}
            onPress={() => handleCheckedChange(option, identifier)}>
            <View style={styles.secondOption}>
              <View style={{minWidth: '50%', maxWidth: '80%'}}>
                <Text
                  style={[
                    styles.firstText,
                    selectedIdentifier === identifier && styles.whiteText,
                  ]}>
                  {title}
                </Text>
                <Text
                  style={[
                    styles.secondText,
                    selectedIdentifier === identifier && styles.whiteText,
                  ]}>
                  {description}
                </Text>
              </View>

              <View>
                <RadioButton
                  onPress={() => handleCheckedChange(option, identifier)}
                  value={identifier}
                  status={
                    selectedIdentifier === identifier ? 'checked' : 'unchecked'
                  }
                  color="#076C38"
                />
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  firstOption: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 24,
    borderRadius: 56,
    borderColor: '#193d1d',
    marginHorizontal: 20,
  },
  secondOption: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 18,
    borderRadius: 56,
    borderColor: '#193d1d',
    marginHorizontal: 20,
    position: 'relative',
    overflow: 'visible',
  },

  optionText: {
    color: '#2F5034',
    lineHeight: 25,
    fontFamily: 'DroidArabicKufi',
    fontSize: 13,
    alignSelf: 'flex-start',
  },
  firstText: {
    color: '#2F5034',
    lineHeight: 27,
    fontSize: 15,
    fontFamily: 'DroidArabicKufi',
    textAlign: Platform.OS == 'ios' ? 'left' : 'right',
  },
  secondText: {
    color: '#2F5034',
    lineHeight: 22,
    fontSize: 13,
    fontFamily: 'DroidArabicKufi',
    paddingTop: 5,
    textAlign: Platform.OS == 'ios' ? 'left' : 'right',
    alignSelf: 'flex-start',
  },
  whiteText: {
    color: 'white',
  },
  container: {
    paddingTop: 25,
  },
  paymentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 56,
  },
  paymentText: {
    color: '#FFFFFF',
    lineHeight: 24,
    fontFamily: 'DroidArabicKufi',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Content;
