import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Use your PC IP for real device
const PROXY_BASE = 'http://192.168.2.3:5050';

const AIChatScreen = () => {
  const { t } = useTranslation();
  const [imageUri, setImageUri] = useState(null);
  const [diseaseResults, setDiseaseResults] = useState([]);
  const [plantDetected, setPlantDetected] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Pick image from gallery
  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
        setDiseaseResults([]);
        setPlantDetected(null);
      }
    });
  };

  // Detect disease
  const detectDisease = async () => {
    if (!imageUri) {
      Alert.alert(t('aiChat.selectImageTitle'), t('aiChat.selectImageMsg'));
      return;
    }

    setLoading(true);
    try {
      const base64Image = await RNFS.readFile(imageUri, 'base64');
      const response = await axios.post(`${PROXY_BASE}/api/health-assess`, {
        images: [base64Image],
      });
      const data = response.data.result;
      setPlantDetected(data.is_plant);
      setDiseaseResults(data.disease?.suggestions || []);
    } catch (error) {
      console.error(t('aiChat.detectionError'), error.response?.data || error.message);
      Alert.alert(t('aiChat.error'), t('aiChat.internetIssue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.topBarTitle}>{t('aiChat.title')}</Text>
        </View>
        <Image source={require('../../images/ai.png')} style={styles.aiDp} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Heading */}
        <Text style={styles.heading}>{t('aiChat.heading')}</Text>

        {/* Upload Image Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
          <Text style={styles.btnText}>{t('aiChat.uploadBtn')}</Text>
        </TouchableOpacity>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        {/* Detect Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={detectDisease}>
          <Text style={styles.btnText}>{t('aiChat.detectBtn')}</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#006644" style={{ marginTop: 20 }} />}

        {/* Results Section */}
        {plantDetected && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{t('aiChat.plantDetection')}</Text>
            <Text>
              {t('aiChat.detectedAsPlant')}: {plantDetected.binary ? t('aiChat.yes') : t('aiChat.no')}
            </Text>
            <Text>
              {t('aiChat.probability')}: {(plantDetected.probability * 100).toFixed(2)}%
            </Text>
          </View>
        )}

        {diseaseResults.length > 0 && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{t('aiChat.diseaseSuggestions')}</Text>
            {diseaseResults.map((disease, index) => (
              <View key={index} style={styles.diseaseCard}>
                <Text style={styles.diseaseName}>⚠️ {disease.name}</Text>
                <Text>
                  {t('aiChat.confidence')}: {(disease.probability * 100).toFixed(2)}%
                </Text>
                <Text style={styles.tip}>
                  {disease.description || t('aiChat.noDescription')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6FFF8' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006644',
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
  },
  backBtn: { padding: 5 },
  titleContainer: { flex: 1, alignItems: 'center' },
  topBarTitle: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  aiDp: { width: 40, height: 40, borderRadius: 20 },
  container: { padding: 20, alignItems: 'center' },
  heading: { fontSize: 18, fontWeight: '600', color: '#2E7D32', marginBottom: 20, textAlign: 'center' },
  actionBtn: {
    backgroundColor: '#006644',
    width: '85%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
    elevation: 3,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  image: { width: 260, height: 260, marginVertical: 15, borderRadius: 15, borderWidth: 2, borderColor: '#006644' },
  resultCard: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#1B5E20' },
  diseaseCard: { backgroundColor: '#DCEDC8', padding: 10, borderRadius: 8, marginTop: 10 },
  diseaseName: { fontWeight: 'bold', color: '#C62828' },
  tip: { marginTop: 5, color: '#33691E' },
});

export default AIChatScreen;
