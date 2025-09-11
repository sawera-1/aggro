import React from 'react';
import { ScrollView, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18next from '../i18n';
import { SafeAreaView } from "react-native-safe-area-context";

const Languagepg = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../images/background.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            zIndex: 1,
            backgroundColor: '#006644',
            padding: 10,
            borderRadius: 50,
          }}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Image source={require('../images/logodark.png')} style={{ width: 300, height: 100, marginBottom: 20 }} />
          
          <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#006644' }}>
            Select Language
          </Text>

          <Image
            source={require('../images/farmer.png')}
            style={{ width: 180, height: 180, resizeMode: 'contain', marginBottom: 30 }}
          />

          {/* English Button */}
          <TouchableOpacity
            onPress={() => {
              i18next.changeLanguage('en');
            }}
            style={{
              backgroundColor: '#006644',
              height: 48,
              width: 200,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>English</Text>
          </TouchableOpacity>

          {/* Urdu Button */}
          <TouchableOpacity
            onPress={() => {
              i18next.changeLanguage('ur');
            }}
            style={{
              backgroundColor: '#006644',
              height: 48,
              width: 200,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>اردو</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Languagepg;
