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
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../images/background.jpg')}
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
          {/* Logo */}
          <Image
            source={require('../../images/logodark.png')}
            style={{ width: 300, height: 100, marginBottom: 20 }}
          />

          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#006644',
              marginBottom: 10,
            }}
          >
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
            onPress={() => navigation.navigate('ExpertOtp')}
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

          {/* login */}
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
