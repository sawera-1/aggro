import React from 'react';
import {  ScrollView, View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native-safe-area-context";
const ExpertOtpSuccess = ({ navigation }) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../images/background.jpg')}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          
          {/* Logo */}
          <Image
            source={require('../../images/logodark.png')}
            style={{ width: 300, height: 100, marginBottom: 20 }}
          />

          {/* Tick Icon */}
          <Image
            source={require('../../images/tick.png')}
            style={{ width: 120, height: 120, marginBottom: 20, resizeMode: 'contain' }}
          />

          {/* Success Text */}
          
          <Text style={{ fontSize: 16, color: '#006644', textAlign: 'center', marginBottom: 20 }}>
           Your OTP has been verified successfully.
          </Text>

          {/* Continue Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#006644',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
              width: '60%',
            }}
            onPress={() => navigation.replace('ExpertBottomTabs')}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}> {t('expertloginSuccess.continue')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default  ExpertOtpSuccess ;
