// ExpertOtp.js
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import NumericPad from '../../Components/Numericpad';
import { useTranslation } from 'react-i18next';
import { expertverifyOtpAndSignUp } from '../../Helper/firebaseHelper';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/Slices/HomeDataSlice';

const ExpertOtp = ({ navigation, route }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const confirmation = useSelector((state) => state.home.confirmation);

  const { phone, expertData } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePress = (num) => {
    if (currentIndex < 6) {
      const newOtp = [...otp];
      newOtp[currentIndex] = num;
      setOtp(newOtp);
      setCurrentIndex(currentIndex + 1);

      if (newOtp.join('').length === 6) {
        handleConfirm(newOtp.join(''));
      }
    }
  };

  const handleBackspace = () => {
    if (currentIndex > 0) {
      const newOtp = [...otp];
      newOtp[currentIndex - 1] = '';
      setOtp(newOtp);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleConfirm = async (codeFromAuto = null) => {
    const code = codeFromAuto || otp.join('');
    if (code.length < 6) {
      Alert.alert('Error', 'Please enter full OTP');
      return;
    }

    try {
      setLoading(true);

      const userData = await expertverifyOtpAndSignUp(
        confirmation,
        code,
        { ...expertData, phone }
      );

      dispatch(setUser(userData));
      navigation.replace('EOtpSuccess');
    } catch (error) {
      console.error('OTP verification failed:', error);
      navigation.replace('EOtpFailure');
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#000', marginBottom: 30 }}>
            {t('expertOtp.title')}
          </Text>

          {/* OTP boxes without .map */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
            <Text style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: 50, height: 50, textAlign: 'center', fontSize: 18, backgroundColor: '#fff', marginHorizontal: 1 }}>
              {otp[0]}
            </Text>
            <Text style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: 50, height: 50, textAlign: 'center', fontSize: 18, backgroundColor: '#fff', marginHorizontal: 1 }}>
              {otp[1]}
            </Text>
            <Text style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: 50, height: 50, textAlign: 'center', fontSize: 18, backgroundColor: '#fff', marginHorizontal: 1 }}>
              {otp[2]}
            </Text>
            <Text style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: 50, height: 50, textAlign: 'center', fontSize: 18, backgroundColor: '#fff', marginHorizontal: 1 }}>
              {otp[3]}
            </Text>
            <Text style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: 50, height: 50, textAlign: 'center', fontSize: 18, backgroundColor: '#fff', marginHorizontal: 1 }}>
              {otp[4]}
            </Text>
            <Text style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: 50, height: 50, textAlign: 'center', fontSize: 18, backgroundColor: '#fff', marginHorizontal: 1 }}>
              {otp[5]}
            </Text>
          </View>

          {/* Numeric Pad */}
          <NumericPad onPressNumber={handlePress} onBackspace={handleBackspace} />

          <TouchableOpacity
            onPress={() => handleConfirm()}
            style={{ backgroundColor: '#006644', padding: 15, borderRadius: 8, alignItems: 'center', width: '60%', marginTop: 20 }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>{t('expertOtp.confirm')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertOtp;
