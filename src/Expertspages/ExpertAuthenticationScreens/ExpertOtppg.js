import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import NumericPad from '../../Components/Numericpad';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
const ExpertOtp = ({ navigation }) => {
    const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showPad, setShowPad] = useState(true);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../images/background.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* Back Button  */}
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
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          {/* Logo */}
          <Image
            source={require('../../images/logodark.png')}
            style={{ width: 200, height: 100, marginBottom: 20 }}
          />

          {/* Heading */}
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#000', textAlign: 'center', marginBottom: 8 }}>
             {t('expertOtp.title')}
          </Text>
          <Text style={{ color: '#555', textAlign: 'center', marginBottom: 30 }}>
           {t('expertOtp.subtitle')}
          </Text>

          {/* OTP Boxes */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 30, width: '80%' }}>
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
              }}
              value={otp[3]}
              editable={false}
            />
          </View>

          {/* Numeric Pad Component */}
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
            }}
            onPress={() => navigation.navigate('EOtpSuccess')}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>{t('expertOtp.confirm')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertOtp;
