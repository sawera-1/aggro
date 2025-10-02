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
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native-safe-area-context";
import Tts from 'react-native-tts';

export default function ExpertGovtReadMore({ navigation, route }) {
  const { t } = useTranslation();
  const { scheme } = route.params;

  //  Function for TTS
const speakEnglish = () => {
  const details = `
    ${scheme.name || "Untitled"}.
    ${scheme.description || "No description available"}.
    Region: ${scheme.region || "Not Specified"}.
    Start Date: ${scheme.startDate || "N/A"}.
    End Date: ${scheme.endDate || "N/A"}.
  `;

  Tts.stop();
  Tts.setDefaultLanguage("en-US");
  Tts.setDefaultVoice("en-us-x-tpf-local"); 
  Tts.setDefaultRate(0.45);
  Tts.setDefaultPitch(1.0);
  Tts.speak(details);
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../images/background.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.9 }}
      >
        {/*  Top Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#006644',
            paddingVertical: 12,
            paddingHorizontal: 15,
            elevation: 4
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            {t('govtReadMore.title')}
          </Text>
        </View>

        {/*  Scrollable Content */}
        <ScrollView contentContainerStyle={{ padding: 15, flexGrow: 1 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 15,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3
            }}
          >
            {/* Image */}
            <Image
              source={scheme.image ? { uri: scheme.image } : require('../../../images/govt.png')}
              style={{ width: '100%', height: 200, borderRadius: 8, resizeMode: 'cover', marginBottom: 15 }}
            />

            {/* Name */}
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#006644', marginBottom: 6 }}>
              {scheme.name || "Untitled"}
            </Text>

            {/* Description */}
            <Text style={{ fontSize: 15, lineHeight: 22, color: '#555', marginBottom: 12 }}>
              {scheme.description || "No description available"}
            </Text>



            {/* Region */}
            <Text style={{ fontSize: 14, marginBottom: 4, color: '#333' }}>
              <Text style={{ fontWeight: 'bold' }}>Region: </Text>
              {scheme.region || "Not Specified"}
            </Text>

            {/* Start Date */}
            <Text style={{ fontSize: 14, marginBottom: 4, color: '#333' }}>
              <Text style={{ fontWeight: 'bold' }}>Start Date: </Text>
              {scheme.startDate || "N/A"}
            </Text>

            {/* End Date */}
            <Text style={{ fontSize: 14, marginBottom: 4, color: '#333' }}>
              <Text style={{ fontWeight: 'bold' }}>End Date: </Text>
              {scheme.endDate || "N/A"}
            </Text>

            {/* URL */}

            {scheme.url ? (
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                {/* Read More Button */}
                <TouchableOpacity
                  onPress={() => Linking.openURL(scheme.url)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#006644',
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    marginRight: 10, 
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                    {t('govtReadMore.readMore')}
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: '#e9e9e1',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 5
                    }}
                  >
                    <Icon name="arrow-forward" size={14} color="#006644" />
                  </View>
                </TouchableOpacity>

                {/* Voice Button */}
                <TouchableOpacity
                  onPress={speakEnglish}
                  style={{
                    backgroundColor: '#006644',
                    padding: 10,
                    borderRadius: 25,
                  }}
                >
                  <Icon name="volume-high" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : null}

          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
