import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useTranslation } from "react-i18next";
import CountryPicker from "react-native-country-picker-modal";
import { sendOtp } from "../../Helper/firebaseHelper";
import NumericPad from "../../Components/Numericpad"; 
import { SafeAreaView } from "react-native-safe-area-context";
const FarmerSignup = ({ navigation }) => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("PK");
  const [callingCode, setCallingCode] = useState("92");
  const [showPad, setShowPad] = useState(false);

  // numeric pad handlers
  const handlePress = (num) => {
    if (phone.length < 11) setPhone((prev) => prev + num);
  };

  const handleBackspace = () => {
    setPhone((prev) => prev.slice(0, -1));
  };

  const handleSignup = async () => {
    if (!phone) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    try {
      const fullPhone = `+${callingCode}${phone}`;
      const confirmation = await sendOtp(fullPhone);

      navigation.navigate("FarmerOtp", {
        confirmation,
        phone: fullPhone,
        mode: "signup",
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../images/background.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          {/* Logo */}
          <Image
            source={require("../../images/logodark.png")}
            style={{ width: 300, height: 200 }}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "#006644", marginBottom: 10 }}>
            {t("farmerSignup.title")}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#006644",
              marginBottom: 30,
              textAlign: "center",
            }}
          >
            {t("farmerSignup.subtitle")}
          </Text>

          {/* Country Picker + Phone Display */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderColor: "#006644",
              borderWidth: 2,
              borderRadius: 10,
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.1)",
              paddingHorizontal: 10,
              paddingVertical: 12,
              marginBottom: 20,
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
            <Text style={{ color: "#006644", fontSize: 20, marginHorizontal: 8 }}>
              +{callingCode}
            </Text>
            <TextInput
              placeholder={t("farmerSignup.phonePlaceholder")}
              placeholderTextColor="#006644"
              value={phone}
              editable={false} // ✅ Only editable via numeric pad
              style={{ flex: 1, fontSize: 20, color: "#006644" }}
            />
          </View>

          {/* Numeric Pad */}
          <NumericPad
            onPressNumber={handlePress}
            onBackspace={handleBackspace}
            onSubmit={handleSignup}
          />

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleSignup}
            style={{
              width: "100%",
              borderRadius: 10,
              backgroundColor: "#006644",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                paddingVertical: 12,
                color: "#ffffff",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {t("farmerSignup.continue")}
            </Text>
          </TouchableOpacity>

          {/* Already have account Login */}
          <Text style={{ color: "#006644", fontSize: 18 }}>
            {t("farmerSignup.alreadyAccount")}{" "}
           <Text
  style={{ fontWeight: "bold", fontSize: 18 }}
  onPress={() => navigation.navigate("FarmerLogin")}
>
  {t("farmerSignup.login")}
</Text>

          </Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default FarmerSignup;
