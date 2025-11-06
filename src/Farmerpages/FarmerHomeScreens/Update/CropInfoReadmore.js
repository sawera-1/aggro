import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from "react-native-safe-area-context";
import Tts from 'react-native-tts';

export default function CropReadMore({ navigation, route }) {
  const { crop } = route.params;

  // ✅ Speak Crop Details
  const speakDetails = () => {
    const details = `
      Crop Name: ${crop?.name || "N/A"}.
      Scientific Name: ${crop?.scientificName || "N/A"}.
      Market Price: ${crop?.marketPrice || "N/A"}.
      Season: ${crop?.season || "N/A"}.
      Duration: ${crop?.duration || "N/A"}.
      Water Requirement: ${crop?.waterRequirement || "N/A"}.
      Soil Type: ${crop?.soilType || "N/A"}.
      Yield Amount: ${crop?.yieldAmount || "N/A"}.
    `;

    Tts.stop(); // stop any previous speech
    Tts.setDefaultLanguage("en-US");
    Tts.setDefaultRate(0.45);
    Tts.setDefaultPitch(1.0);
    Tts.speak(details);
  };

  // ✅ Stop Speaking
  const stopSpeaking = () => {
    Tts.stop();
  };

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
            {crop?.name || "Crop Info"}
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
            {/* Image */}
            <Image
              source={require('../../../images/a.png')}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 8,
                resizeMode: 'cover',
                marginBottom: 15,
              }}
            />

            {/* Crop Info */}
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#006644', marginBottom: 6 }}>
              {crop?.name || "N/A"}
            </Text>

            <Text style={{ fontSize: 16, color: '#333', marginBottom: 6 }}>
              🔬 Scientific Name: {crop?.scientificName || "N/A"}
            </Text>

            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>
              💰 Market Price: {crop?.marketPrice || "N/A"}
            </Text>

            <Text style={{ fontSize: 15, lineHeight: 22, color: '#555', marginBottom: 12 }}>
              🌱 Season: {crop?.season || "N/A"}
            </Text>

            <Text style={{ fontSize: 15, marginBottom: 4, color: '#333' }}>
              ⏳ Duration: {crop?.duration || "N/A"}
            </Text>

            <Text style={{ fontSize: 15, marginBottom: 4, color: '#333' }}>
              💧 Water: {crop?.waterRequirement || "N/A"}
            </Text>

            <Text style={{ fontSize: 15, marginBottom: 4, color: '#333' }}>
              🌍 Soil: {crop?.soilType || "N/A"}
            </Text>

            <Text style={{ fontSize: 15, marginBottom: 4, color: '#333' }}>
              📦 Yield Amount: {crop?.yieldAmount || "N/A"}
            </Text>

            {/* Buttons Row */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
                justifyContent: 'space-between',
              }}
            >
              {/* Read More Button */}
              <TouchableOpacity
                onPress={() => {
                  if (crop?.url && crop.url.trim() !== "") {
                    Linking.openURL(crop.url);
                  } else {
                    alert("No link available");
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
                  Read More
                </Text>
              </TouchableOpacity>

              {/* 🔊 Speaker + Stop Buttons */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={speakDetails}
                  style={{
                    backgroundColor: '#006644',
                    padding: 10,
                    borderRadius: 25,
                  }}
                >
                  <Icon name="volume-high" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={stopSpeaking}
                  style={{
                    backgroundColor: '#cc0000',
                    padding: 10,
                    borderRadius: 25,
                  }}
                >
                  <Icon name="stop" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
