import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { expertsendOtp } from '../../Helper/firebaseHelper';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux'; 
import { setConfirmation } from '../../redux/Slices/HomeDataSlice';

const ExpertSignup = ({ navigation }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('PK');
  const [callingCode, setCallingCode] = useState('92');
  const dispatch = useDispatch(); 
  
const handleContinue = async () => {
  if (!name || !qualification || !specialization || !experience || !phone) {
    Alert.alert('Error', 'Please fill all fields');
    return;
  }

  if (!phone.match(/^\d{10,}$/)) {
    Alert.alert('Invalid Phone', 'Please enter a valid phone number');
    return;
  }

  if (!password || password.length < 6) {
    Alert.alert('Invalid Password', 'Password must be at least 6 characters');
    return;
  }

  try {
    const fullPhone = `+${callingCode}${phone}`;
    const verificationId = await expertsendOtp(fullPhone);

    // store in Redux
    dispatch(setConfirmation(verificationId));

    navigation.navigate('ExpertOtp', {
      phone: fullPhone,
      expertData: {
        name,
        qualification,
        specialization,
        experience,
        password,
        role: 'expert',
      },
    });
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to send OTP. Please try again.');
  }
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../images/background.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          {/* Logo */}
          <Image
            source={require('../../images/logodark.png')}
            style={{ width: 300, height: 100, marginBottom: 20 }}
          />

          {/* Title */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#006644', marginBottom: 10 }}>
            {t('expertSignup.title')}
          </Text>
          <Text style={{ fontSize: 14, color: '#006644', marginBottom: 30 }}>
            {t('expertSignup.subtitle')}
          </Text>

          {/* Name */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('expertSignup.fullName')}
            placeholderTextColor="#006644"
            style={{
              borderColor: '#006644',
              borderWidth: 2,
              borderRadius: 10,
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 10,
              paddingVertical: 16,
              fontSize: 16,
              color: '#006644',
              marginBottom: 15,
            }}
          />

          {/* Qualification */}
          <TextInput
            value={qualification}
            onChangeText={setQualification}
            placeholder={t('expertSignup.qualification')}
            placeholderTextColor="#006644"
            style={{
              borderColor: '#006644',
              borderWidth: 2,
              borderRadius: 10,
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 10,
              paddingVertical: 16,
              fontSize: 16,
              color: '#006644',
              marginBottom: 15,
            }}
          />

          {/* Specialization */}
          <TextInput
            value={specialization}
            onChangeText={setSpecialization}
            placeholder={t('expertSignup.specialization')}
            placeholderTextColor="#006644"
            style={{
              borderColor: '#006644',
              borderWidth: 2,
              borderRadius: 10,
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 10,
              paddingVertical: 16,
              fontSize: 16,
              color: '#006644',
              marginBottom: 15,
            }}
          />

          {/* Experience */}
          <TextInput
            value={experience}
            onChangeText={setExperience}
            placeholder={t('expertSignup.experience')}
            placeholderTextColor="#006644"
            keyboardType="numeric"
            style={{
              borderColor: '#006644',
              borderWidth: 2,
              borderRadius: 10,
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 10,
              paddingVertical: 16,
              fontSize: 16,
              color: '#006644',
              marginBottom: 15,
            }}
          />

          {/* Phone with Country Picker */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: '#006644',
              borderWidth: 2,
              borderRadius: 10,
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginBottom: 15,
            }}
          >
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withModal
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
            />
            <Text style={{ color: '#006644', fontSize: 16, marginHorizontal: 8 }}>
              +{callingCode}
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder={t('expertSignup.phone')}
              placeholderTextColor="#006644"
              keyboardType="numeric"
              style={{ flex: 1, fontSize: 16, color: '#006644' }}
            />
          </View>

          {/* Password */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: '#006644',
              borderWidth: 2,
              borderRadius: 10,
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginBottom: 15,
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t('expertSignup.password')}
              placeholderTextColor="#006644"
              secureTextEntry={!showPassword}
              style={{ flex: 1, fontSize: 16, color: '#006644' }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#006644"
              />
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            style={{
              width: '100%',
              borderRadius: 10,
              backgroundColor: '#006644',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                paddingVertical: 12,
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              {t('expertSignup.continue')}
            </Text>
          </TouchableOpacity>

          {/* Login Redirect */}
          <Text style={{ color: '#006644' }}>
            {t('expertSignup.alreadyAccount')}{' '}
            <Text
              style={{ fontWeight: 'bold', fontSize: 18 }}
              onPress={() => navigation.navigate('ExpertLogin')}
            >
              {t('expertSignup.login')}
            </Text>
          </Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertSignup;
