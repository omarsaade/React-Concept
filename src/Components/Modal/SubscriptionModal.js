import React, {useEffect} from 'react';
import {Modal} from 'react-native';
import MembershipPopup from '../Subscriptions/MembershipPopup';
import {useSelector} from 'react-redux';
import {getOfferings} from '../../Services/ConfigurePurchases';
import {setCloseBtn} from '../../Services/GlobalFn';

const SubscriptionModal = () => {
  const isSubscriptionModalVisible = useSelector(
    state => state.register.isSubscriptionModalVisible,
  );
  const isSubscribed = useSelector(state => state.register.isSubscribed);

  useEffect(() => {
    if (isSubscriptionModalVisible && !isSubscribed) {
      getOfferings();
      setCloseBtn();
    }
  }, [isSubscriptionModalVisible]);

  return (
    <Modal
      visible={!isSubscribed && isSubscriptionModalVisible}
      animationType="slide">
      <MembershipPopup />
    </Modal>
  );
};

export default SubscriptionModal;
