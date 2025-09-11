import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getExpertData, updateUserData } from '../Helper/firebaseHelper';


export default function ExpertMyAcc() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [dpImage, setDpImage] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const data = await getExpertData();
        if (data) {
          setName(data.name || '');
          setPhone(data.phoneNumber || '');
          setQualification(data.qualification || '');
          setSpecialization(data.specialization || '');
          setExperience(data.experience || '');
          setDpImage(data.dpImage || null);
        }
      } catch (error) {
        console.error('Error fetching expert data:', error);
        Alert.alert('Error', 'Failed to load expert data.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
  }, []);

  // ✅ Open camera to take photo
  const openCamera = () => {
    launchCamera({ mediaType: 'photo', saveToPhotos: true }, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      const asset = response.assets?.[0];
      if (asset?.uri) setDpImage(asset.uri);
    });
  };

  const handleSave = async () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Name and phone number are required.');
      return;
    }
    try {
      await updateUserData({
        name,
        phoneNumber: phone,
        qualification,
        specialization,
        experience,
        dpImage,
      });
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#006644" />
      </SafeAreaView>
    );
  }

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
            paddingVertical: 12,
            backgroundColor: '#006644',
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
            {t('expertMyaccount.myAccount')}
          </Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}>
          {/* Profile Image with Camera Icon */}
          <View style={{ alignSelf: 'center', marginBottom: 20, position: 'relative' }}>
            <Image
              source={dpImage ? { uri: dpImage } : require('../images/a.png')}
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                borderWidth: 3,
                borderColor: '#006644',
              }}
            />
            <TouchableOpacity
              onPress={openCamera}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#006644',
                borderRadius: 20,
                padding: 6,
              }}
            >
              <Icon name="photo-camera" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <Text style={labelStyle}>{t('expertMyaccount.name')}</Text>
          <TextInput
            placeholder={t('expertMyaccount.enterName')}
            value={name}
            onChangeText={setName}
            style={inputStyle}
          />

          <Text style={labelStyle}>{t('expertMyaccount.phoneNumber')}</Text>
          <TextInput
            placeholder={t('expertMyaccount.enterPhone')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={inputStyle}
          />

          <Text style={labelStyle}>{t('expertMyaccount.qualification')}</Text>
          <TextInput
            placeholder={t('expertMyaccount.enterQualification')}
            value={qualification}
            onChangeText={setQualification}
            style={inputStyle}
          />

          <Text style={labelStyle}>{t('expertMyaccount.specialization')}</Text>
          <TextInput
            placeholder={t('expertMyaccount.enterSpecialization')}
            value={specialization}
            onChangeText={setSpecialization}
            style={inputStyle}
          />

          <Text style={labelStyle}>{t('expertMyaccount.experience')}</Text>
          <TextInput
            placeholder={t('expertMyaccount.enterExperience')}
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            style={inputStyle}
          />

          <TouchableOpacity style={saveBtnStyle} onPress={handleSave}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              {t('expertMyaccount.save')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const inputStyle = {
  backgroundColor: '#fff',
  borderRadius: 10,
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  marginBottom: 15,
};

const labelStyle = {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#006644',
  marginBottom: 5,
};

const saveBtnStyle = {
  backgroundColor: '#006644',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 30,
};
