import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import NumericPad from '../../Components/Numericpad';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { verifyOtpAndSaveUser } from '../../Helper/firebaseHelper';
import { setUser } from '../../redux/Slices/HomeDataSlice';

const FarmerOtp = ({ navigation }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const confirmation = useSelector((state) => state.home.confirmation);
  const dispatch = useDispatch();

  const handlePress = (num) => {
    if (currentIndex < 4) {
      const newOtp = [...otp];
      newOtp[currentIndex] = num;
      setOtp(newOtp);
      setCurrentIndex(currentIndex + 1);

      // Auto-submit when OTP completed
      if (newOtp.join('').length === 4) {
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

    if (code.length < 4) {
      alert(t('farmerOtp.incompleteOtp'));
      return;
    }

    try {
      setLoading(true);
      const userData = await verifyOtpAndSaveUser(confirmation, code, {
        role: 'farmer',
      });

      dispatch(setUser(userData));
      navigation.replace('OtpSuccess'); // ✅ success
    } catch (error) {
      console.error('OTP verification failed:', error.message);
      navigation.replace('OtpFailure'); // ❌ failure
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
            style={{ width: 200, height: 100, marginBottom: 20 }}
          />

          {/* Heading */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#000',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            {t('farmerOtp.title')}
          </Text>
          <Text style={{ color: '#555', textAlign: 'center', marginBottom: 30 }}>
            {t('farmerOtp.subtitle')}
          </Text>

          {/* OTP Boxes */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginBottom: 30,
              width: '80%',
            }}
          >
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  width: 50,
                  height: 50,
                  textAlign: 'center',
                  fontSize: 18,
                  backgroundColor: '#fff',
                }}
                value={digit}
                editable={false}
              />
            ))}
          </View>

          {/* Numeric Pad */}
          <NumericPad
            onPressNumber={handlePress}
            onBackspace={handleBackspace}
            onSubmit={handleConfirm}
          />

          {/* Confirm Button */}
          <TouchableOpacity
            disabled={loading}
            style={{
              backgroundColor: loading ? '#999' : '#006644',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
              width: '60%',
              marginTop: 20,
            }}
            onPress={() => handleConfirm()}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16 }}>
                {t('farmerOtp.confirm')}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default FarmerOtp;
