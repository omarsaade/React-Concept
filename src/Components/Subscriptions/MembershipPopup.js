import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import Header from './Header';
import Footer from './Footer';

const MembershipPopup = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#111C13'}}>
      <ScrollView style={{flex: 1, backgroundColor: '#111C13'}}>
        <Header />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MembershipPopup;
