import React, { useState } from 'react';
import {  ScrollView, View, Text, TextInput, TouchableOpacity, ImageBackground, Image, Alert 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { firestore } from '../../firebase'; // Make sure firestore is imported
import { SafeAreaView } from "react-native-safe-area-context";
const ExpertChangePassword = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { phone } = route.params; // get phone from OTP screen

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      // Find user by phone number
      const snapshot = await firestore()
        .collection('users')
        .where('phoneNumber', '==', phone)
        .get();

      if (snapshot.empty) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // Update password
      const docId = snapshot.docs[0].id;
      await firestore().collection('users').doc(docId).update({ password: newPassword });

      Alert.alert('Success', 'Password updated successfully');
      navigation.replace('ExpertBottomTabs'); // Navigate to home or login
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update password');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../images/background.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Image
            source={require('../../images/logodark.png')}
            style={{ width: 250, height: 80, marginBottom: 30 }}
          />

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
            onPress={handleResetPassword}
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
