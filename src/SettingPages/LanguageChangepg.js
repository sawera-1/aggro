import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const Languagepg = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../images/background.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ resizeMode: 'cover', opacity: 0.9 }}
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
              {t('languagePage.userName')}
            </Text>
            <Text style={{ color: '#fff', fontSize: 13 }}>
              {t('languagePage.userPhone')}
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: 'bold',
              marginBottom: 20,
              color: '#006644',
              borderRadius: 8,
            }}
          >
            {t('languagePage.title')}
          </Text>

          <Image
            source={require('../images/farmer.png')}
            style={{
              width: 180,
              height: 180,
              resizeMode: 'contain',
              marginBottom: 30,
            }}
          />

          <TouchableOpacity
            style={{
              backgroundColor: '#006644',
              height: 48,
              width: 200,
              borderRadius: 10,
              marginBottom: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
              {t('languagePage.english')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#006644',
              height: 48,
              width: 200,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
              {t('languagePage.urdu')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Languagepg;
