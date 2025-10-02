import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import NumericPad from '../../Components/Numericpad';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/Slices/HomeDataSlice';
import { SafeAreaView } from "react-native-safe-area-context";
import { verifyOtpForLogin } from "../../Helper/firebaseHelper";

const FarmerOtp = ({ navigation, route }) => {
  const { confirmation, phone } = route.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePress = (num) => {
    if (currentIndex < 6) {
      const newOtp = [...otp];
      newOtp[currentIndex] = num;
      setOtp(newOtp);
      setCurrentIndex(currentIndex + 1);

      if (currentIndex + 1 === 6) handleConfirm(newOtp.join(''));
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
      Alert.alert('Error', 'Enter full OTP');
      return;
    }

    try {
      setLoading(true);
      // ✅ Verify OTP and get user
      const user = await verifyOtpForLogin(confirmation, code);
      if (!user) {
        Alert.alert("No account found", "Please sign up first.");
        navigation.replace("FarmerSignup");
        return;
      }

      dispatch(setUser(user));
      navigation.replace("OtpSuccess");
    } catch (error) {
      console.error("OTP verification failed:", error.message);
      Alert.alert("Invalid OTP", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require('../../images/background.jpg')} style={{ flex: 1 }} resizeMode="cover">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Image source={require('../../images/logodark.png')} style={{ width: 200, height: 100, marginBottom: 20 }} />
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#000', textAlign: 'center', marginBottom: 8 }}>
            {t('farmerOtp.title')}
          </Text>
          <Text style={{ color: '#555', textAlign: 'center', marginBottom: 30 }}>
            {t('farmerOtp.subtitle')}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
            {otp.map((val, index) => (
              <TextInput key={index} value={val} editable={false} style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                width: 50,
                height: 50,
                textAlign: 'center',
                fontSize: 18,
                backgroundColor: '#fff',
                marginHorizontal: 3,
              }} />
            ))}
          </View>

          <NumericPad onPressNumber={handlePress} onBackspace={handleBackspace} onSubmit={handleConfirm} />

          <TouchableOpacity
            disabled={loading}
            style={{ backgroundColor: loading ? '#999' : '#006644', padding: 15, borderRadius: 8, alignItems: 'center', width: '60%', marginTop: 20 }}
            onPress={() => handleConfirm()}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16 }}>{t('farmerOtp.confirm')}</Text>}
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default FarmerOtp;
