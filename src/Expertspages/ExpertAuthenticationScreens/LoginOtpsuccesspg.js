import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
const EOtpSuccess = ({ navigation }) => {
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
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#006644', marginBottom: 10 }}>
             {t('loginotpSuccess.success')}
          </Text>
          <Text style={{ fontSize: 16, color: '#006644', textAlign: 'center', marginBottom: 20 }}>
            {t('loginotpSuccess.verified')}
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
            onPress={() => navigation.replace('ExpertWaiting')}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>{t('loginotpSuccess.continue')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default EOtpSuccess;
