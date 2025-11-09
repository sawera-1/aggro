import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native-safe-area-context";
import Tts from 'react-native-tts';

export default function ExpertCropReadMore({ navigation, route }) {
  const { t } = useTranslation();
  const { crop } = route.params;
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 🔊 Speak / Toggle
  const toggleSpeak = () => {
    if (isSpeaking) {
      Tts.stop();
      setIsSpeaking(false);
      return;
    }

    const details = `
      ${t('cropReadMore.cropName')}: ${crop?.name || t('cropReadMore.na')}.
      ${t('cropReadMore.scientificName')}: ${crop?.scientificName || t('cropReadMore.na')}.
      ${t('cropReadMore.marketPrice')}: ${crop?.marketPrice || t('cropReadMore.na')}.
      ${t('cropReadMore.season')}: ${crop?.season || t('cropReadMore.na')}.
      ${t('cropReadMore.duration')}: ${crop?.duration || t('cropReadMore.na')}.
      ${t('cropReadMore.waterRequirement')}: ${crop?.waterRequirement || t('cropReadMore.na')}.
      ${t('cropReadMore.soilType')}: ${crop?.soilType || t('cropReadMore.na')}.
      ${t('cropReadMore.yieldAmount')}: ${crop?.yieldAmount || t('cropReadMore.na')}.
    `;

    Tts.stop();
    Tts.setDefaultLanguage("en-US");
    Tts.setDefaultRate(0.45);
    Tts.setDefaultPitch(1.0);
    setIsSpeaking(true);
    Tts.speak(details);
  };

  // ⏹ Stop function
  const stopSpeaking = () => {
    Tts.stop();
    setIsSpeaking(false);
  };

  // Auto reset when TTS finishes
  useEffect(() => {
    const finishListener = Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    const cancelListener = Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));
    return () => {
      finishListener.remove();
      cancelListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../images/background.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.85 }}
      >
        {/* Top Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#006644',
            paddingVertical: 12,
            paddingHorizontal: 15,
            elevation: 4,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            {crop?.name || t('cropReadMore.title')}
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={{ padding: 15, flexGrow: 1 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 15,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            <Image
              source={require('../../../images/a.png')}
              style={{ width: '100%', height: 200, borderRadius: 8, resizeMode: 'cover', marginBottom: 15 }}
            />

            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#006644', marginBottom: 6 }}>
              {crop?.name || t('cropReadMore.na')}
            </Text>

            <Text style={{ fontSize: 16, color: '#333', marginBottom: 6 }}>
              🔬 {t('cropReadMore.scientificName')}: {crop?.scientificName || t('cropReadMore.na')}
            </Text>

            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>
              💰 {t('cropReadMore.marketPrice')}: {crop?.marketPrice || t('cropReadMore.na')}
            </Text>

            <Text style={{ fontSize: 15, lineHeight: 22, color: '#555', marginBottom: 12 }}>
              🌱 {t('cropReadMore.season')}: {crop?.season || t('cropReadMore.na')}
            </Text>

            <Text style={{ fontSize: 15, marginBottom: 4, color: '#333' }}>
              ⏳ {t('cropReadMore.duration')}: {crop?.duration || t('cropReadMore.na')}
            </Text>

            <Text style={{ fontSize: 15, marginBottom: 4, color: '#333' }}>
              💧 {t('cropReadMore.waterRequirement')}: {crop?.waterRequirement || t('cropReadMore.na')}
            </Text>

            <Text style={{ fontSize: 15, marginBottom: 4, color: '#333' }}>
              🌍 {t('cropReadMore.soilType')}: {crop?.soilType || t('cropReadMore.na')}
            </Text>

            <Text style={{ fontSize: 15, marginBottom: 4, color: '#333' }}>
              📦 {t('cropReadMore.yieldAmount')}: {crop?.yieldAmount || t('cropReadMore.na')}
            </Text>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => {
                  if (crop?.url && crop.url.trim() !== "") {
                    Linking.openURL(crop.url);
                  } else {
                    Alert.alert(t('cropReadMore.noLink'));
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#006644',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                  {t('cropReadMore.readMore')}
                </Text>
              </TouchableOpacity>

              {/* 🔊 Speaker / Stop toggle */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {!isSpeaking && (
                  <TouchableOpacity
                    onPress={toggleSpeak}
                    style={{ backgroundColor: '#006644', padding: 10, borderRadius: 25 }}
                  >
                    <Icon name="volume-high" size={20} color="#fff" />
                  </TouchableOpacity>
                )}

                {isSpeaking && (
                  <TouchableOpacity
                    onPress={toggleSpeak}
                    style={{ backgroundColor: 'red', padding: 10, borderRadius: 25 }}
                  >
                    <Icon name="stop" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
