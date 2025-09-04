import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import NumericPad from '../../Components/Numericpad';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';  

//redux and signup 
import { sendOtp } from "../../Helper/firebaseHelper";  
import { useDispatch } from "react-redux";
import { setConfirmation } from "../../redux/Slices/HomeDataSlice"; 

const Farmersignup = ({ navigation }) => {
    const { t } = useTranslation(); 

    const [phone, setPhone] = useState('');
    const [showPad, setShowPad] = useState(false);
    const [countryCode, setCountryCode] = useState('PK');
    const [callingCode, setCallingCode] = useState('92');


    //logic of redux 
    const dispatch = useDispatch();

const handleContinue = async () => {
  try {
    if (!phone) {
      alert("Please enter a phone number");
      return;
    }

    const fullPhone = `+${callingCode}${phone}`;
    const confirmation = await sendOtp(fullPhone);

    
    dispatch(setConfirmation(confirmation));

    // navigate to OTP screen
    navigation.navigate("FarmerOtp", { phone: fullPhone });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    alert("Failed to send OTP. Try again.");
  }
};


   const handlePress = (num) => {
  setPhone(phone + num);
};


    const handleBackspace = () => setPhone(phone.slice(0, -1));

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
                       gap:15
                    }}
                >
                    {/* Logo */}
                    <Image
                        source={require('../../images/logodark.png')}
                        style={{ width: 300, height: 100, marginBottom: 20 }}
                    />

                    {/* Title */}
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#006644', marginBottom: 10 }}>
                        {t("farmerSignup.title")}
                    </Text>
                    <Text style={{ fontSize: 18, color: '#006644', marginBottom: 30 }}>
                        {t("farmerSignup.subtitle")}
                    </Text>

                    {/* Phone Input */}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setShowPad(true)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: '#006644',
                            borderWidth: 2,
                            borderRadius: 10,
                            width: '100%',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            paddingHorizontal: 10,
                            paddingVertical: 12,
                            marginBottom: 15,
                        }}
                    >
                        <CountryPicker
                            countryCode={countryCode}
                            withFilter
                            withFlag
                            withAlphaFilter
                            withCallingCode
                            withModal
                            onSelect={(country) => {
                                setCountryCode(country.cca2);
                                setCallingCode(country.callingCode[0]);
                            }}
                        />
                        <Text style={{ color: '#006644', fontSize: 20, marginHorizontal: 8 }}>
                            +{callingCode}
                        </Text>
                        <TextInput
                            value={phone}
                            placeholder={t("farmerSignup.phonePlaceholder")}   
                            placeholderTextColor="#006644"
                            editable={false}
                            style={{ flex: 1, fontSize: 20, color: '#006644' }}
                        />
                    </TouchableOpacity>

                    {/* Numeric pad */}
                    {showPad && (
                        <NumericPad
                            onPressNumber={handlePress}
                            onBackspace={handleBackspace}
                            onSubmit={() => setShowPad(false)}
                        />
                    )}

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
  <Text style={{ paddingVertical: 12, color: '#ffffff', fontSize: 20, fontWeight: 'bold' }}>
    {t("farmerSignup.continue")}
  </Text>
</TouchableOpacity>


                    {/* Login */}
                    <Text style={{ color: '#006644' ,fontSize: 18 }}>
                        {t("farmerSignup.alreadyAccount")}{" "}
                        <Text style={{ fontWeight: 'bold',fontSize: 18 }} onPress={() => navigation.navigate('FarmerLogin')}>
                            {t("farmerSignup.login")}
                        </Text>
                    </Text>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default Farmersignup;
