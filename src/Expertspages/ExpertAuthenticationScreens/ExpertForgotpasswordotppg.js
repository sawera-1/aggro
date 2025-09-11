import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image,  ScrollView, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import NumericPad from '../../Components/Numericpad';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native-safe-area-context";
const ExpertpasswordOtp = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPad, setShowPad] = useState(true);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // ✅ Get phone + confirmation from params
  const { phone, confirmation } = route.params || {};

  const handlePress = (num) => {
    const newOtp = [...otp];
    const index = newOtp.findIndex((val) => val === '');
    if (index !== -1) {
      newOtp[index] = num;
      setOtp(newOtp);
    }
  };

  const handleBackspace = () => {
    const newOtp = [...otp];
    const index = newOtp.findLastIndex((val) => val !== '');
    if (index !== -1) {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  // ✅ Confirm OTP with Firebase
  const handleConfirmOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      Alert.alert('Error', 'Please enter the full OTP');
      return;
    }

    try {
      setLoading(true);
      await confirmation.confirm(code); // 🔑 Firebase verification
      // If success → go to Change Password
      navigation.replace('ExpertChangePassword', { phone });
    } catch (error) {
      console.log('OTP verification failed:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
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
            style={{ width: 200, height: 100, marginBottom: 20 }}
          />

          {/* Heading */}
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#000', textAlign: 'center', marginBottom: 8 }}>
            {t('expertpasswordOtp.title')}
          </Text>

          {/* ✅ Show phone number */}
          {phone && (
            <Text style={{ color: '#006644', fontWeight: '500', marginBottom: 20 }}>
              {t('expertpasswordOtp.subtitle')} {phone}
            </Text>
          )}

          {/* OTP Boxes */}
         
                   <View
                     style={{
                       flexDirection: 'row',
                       justifyContent: 'center',
                       marginBottom: 30,
                     }}
                   >
                     <TextInput
                       style={{
                         borderWidth: 1,
                         borderColor: '#ccc',
                         borderRadius: 8,
                         width: 50,
                         height: 50,
                         textAlign: 'center',
                         fontSize: 18,
                         backgroundColor: '#fff',
                         marginHorizontal: 1,
                       }}
                       value={otp[0]}
                       editable={false}
                     />
                     <TextInput
                       style={{
                         borderWidth: 1,
                         borderColor: '#ccc',
                         borderRadius: 8,
                         width: 50,
                         height: 50,
                         textAlign: 'center',
                         fontSize: 18,
                         backgroundColor: '#fff',
                         marginHorizontal: 1,
                       }}
                       value={otp[1]}
                       editable={false}
                     />
                     <TextInput
                       style={{
                         borderWidth: 1,
                         borderColor: '#ccc',
                         borderRadius: 8,
                         width: 50,
                         height: 50,
                         textAlign: 'center',
                         fontSize: 18,
                         backgroundColor: '#fff',
                         marginHorizontal: 1,
                       }}
                       value={otp[2]}
                       editable={false}
                     />
                     <TextInput
                       style={{
                         borderWidth: 1,
                         borderColor: '#ccc',
                         borderRadius: 8,
                         width: 50,
                         height: 50,
                         textAlign: 'center',
                         fontSize: 18,
                         backgroundColor: '#fff',
                         marginHorizontal: 1,
                       }}
                       value={otp[3]}
                       editable={false}
                     />
                     <TextInput
                       style={{
                         borderWidth: 1,
                         borderColor: '#ccc',
                         borderRadius: 8,
                         width: 50,
                         height: 50,
                         textAlign: 'center',
                         fontSize: 18,
                         backgroundColor: '#fff',
                         marginHorizontal: 1,
                       }}
                       value={otp[4]}
                       editable={false}
                     />
                     <TextInput
                       style={{
                         borderWidth: 1,
                         borderColor: '#ccc',
                         borderRadius: 8,
                         width: 50,
                         height: 50,
                         textAlign: 'center',
                         fontSize: 18,
                         backgroundColor: '#fff',
                         marginHorizontal: 1,
                       }}
                       value={otp[5]}
                       editable={false}
                     />
                   </View>
         
          {/* Numeric Pad */}
          {showPad && (
            <NumericPad
              onPressNumber={handlePress}
              onBackspace={handleBackspace}
              onSubmit={() => setShowPad(false)}
            />
          )}

          {/* Confirm Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#006644',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
              width: '60%',
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            onPress={handleConfirmOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16 }}>{t('expertpasswordOtp.confirm')}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertpasswordOtp;
