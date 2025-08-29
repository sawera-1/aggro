import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const ExpertChangePassword = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { t } = useTranslation();



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
            {t('changePassword.title')}
          </Text>

          {/* New Password */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: '#006644',
              borderWidth: 1,
              borderRadius: 10,
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginBottom: 15,
            }}
          >
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder={t('changePassword.newPassword')}
              placeholderTextColor="#006644"
              secureTextEntry={!showPassword}
              style={{ flex: 1, fontSize: 16, color: '#006644' }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#006644"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: '#006644',
              borderWidth: 1,
              borderRadius: 10,
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginBottom: 25,
            }}
          >
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('changePassword.confirmPassword')}
              placeholderTextColor="#006644"
              secureTextEntry={!showConfirmPassword}
              style={{ flex: 1, fontSize: 16, color: '#006644' }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={22}
                color="#006644"
              />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ExpertBottomTabs')}
            style={{
              width: '100%',
              borderRadius: 10,
              backgroundColor: '#006644',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{ paddingVertical: 12, color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>
              {t('changePassword.resetPassword')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertChangePassword;
