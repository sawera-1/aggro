import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';

const EOtpFailure = ({ navigation }) => {
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

          {/* Cross Icon */}
          <Image
            source={require('../../images/cross.png')}
            style={{ width: 120, height: 120, marginBottom: 20, resizeMode: 'contain' }}
          />

          {/* Error Text */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#ff8d73', marginBottom: 10 }}>
            {t('OtpFailure.wrong')}
          </Text>
          <Text style={{ fontSize: 16, color: '#ff8d73', textAlign: 'center', marginBottom: 20 }}>
            {t('OtpFailure.notVerified')}
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
            onPress={() => navigation.navigate('ExpertOtp')}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>
              {t('OtpFailure.tryAgain')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default EOtpFailure;
