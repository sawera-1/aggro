import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView,  ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy({ navigation }) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../images/background.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.9 }}
      >
        {/* Top Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 15,
            backgroundColor: '#006644',
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={require('../images/a.png')}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
          />
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
              {t('privacyPolicy.userName')}
            </Text>
            <Text style={{ color: '#fff', fontSize: 13 }}>
              {t('privacyPolicy.userPhone')}
            </Text>
          </View>
        </View>

        {/* Privacy Policy Content */}
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 }}>
            {t('privacyPolicy.title1')}
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22, color: '#444' }}>
            {t('privacyPolicy.desc1')}
          </Text>

          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 }}>
            {t('privacyPolicy.title2')}
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22, color: '#444' }}>
            {t('privacyPolicy.desc2')}
          </Text>

          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 }}>
            {t('privacyPolicy.title3')}
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22, color: '#444' }}>
            {t('privacyPolicy.desc3')}
          </Text>

          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 }}>
            {t('privacyPolicy.title4')}
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22, color: '#444' }}>
            {t('privacyPolicy.desc4')}
          </Text>

          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 }}>
            {t('privacyPolicy.title5')}
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22, color: '#444' }}>
            {t('privacyPolicy.desc5')}
          </Text>

          {/* Copyright */}
          <Text
            style={{
              fontSize: 13,
              color: '#000',
              textAlign: 'center',
              marginTop: 20,
              paddingVertical: 20,
            }}
          >
            {t('privacyPolicy.copyright')}
          </Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
