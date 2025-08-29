import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const ExpertLogin = ({ navigation }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
            style={{ width: 250, height: 80, marginBottom: 30 }}
          />

          {/* Title */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#006644', marginBottom: 30 }}>
            {t('expertLogin.title')}
          </Text>

          {/* Name */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('expertLogin.fullName')}
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
              placeholder={t('expertLogin.password')}
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

          {/* Login Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ExpertloginSuccess')}
            style={{
              width: '100%',
              borderRadius: 10,
              backgroundColor: '#006644',
              alignItems: 'center',
              marginBottom: 15,
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
              {t('expertLogin.login')}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => navigation.navigate('ExpertpasswordOtp')}>
            <Text style={{ color: '#006644', marginBottom: 20, fontSize: 16 }}>
              {t('expertLogin.forgotPassword')}
            </Text>
          </TouchableOpacity>

          {/* signup */}
          <Text style={{ color: '#006644' }}>
            {t('expertLogin.noAccount')}{' '}
            <Text
              style={{ fontWeight: 'bold', fontSize: 16 }}
              onPress={() => navigation.navigate('ExpertSignup')}
            >
              {t('expertLogin.signup')}
            </Text>
          </Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertLogin;
