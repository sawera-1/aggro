import React from 'react';
import { ScrollView, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native-safe-area-context";

const OtpFailure = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../images/background.jpg')}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
        >
          {/* Logo */}
          <Image
            source={require('../../images/logodark.png')}
            style={{ width: 300, height: 100, marginBottom: 20 }}
          />

          {/* Cross Icon */}
          <Image
            source={require('../../images/cross.png')}
            style={{ width: 120, height: 120, marginBottom: 20, resizeMode: 'contain' }}
          />

          {/* Error Text */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#ff8d73', marginBottom: 10 }}>
            {i18n.language === 'ur' ? "او ٹی پی ناکام" : "OTP Failed"}
          </Text>
          <Text style={{ fontSize: 16, color: '#ff8d73', textAlign: 'center', marginBottom: 20 }}>
            {i18n.language === 'ur'
              ? "براہ کرم دوبارہ کوشش کریں یا فون نمبر دوبارہ درج کریں۔"
              : "Please try again or re-enter your phone number."}
          </Text>

          {/* Retry Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#006644',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
              width: '60%',
            }}
            onPress={() => navigation.navigate('FarmerSignup')}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>
              {i18n.language === 'ur' ? "دوبارہ کوشش کریں" : "Retry"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OtpFailure;
