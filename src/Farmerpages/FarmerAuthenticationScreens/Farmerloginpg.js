import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import NumericPad from "../../Components/Numericpad";
import { sendOtp } from "../../Helper/firebaseHelper";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const FarmerLogin = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("PK");
  const [callingCode, setCallingCode] = useState("92");
  const [showPad, setShowPad] = useState(false);
  const [loading, setLoading] = useState(false); // loading state

  const handlePress = (num) => {
    if (!loading && phone.length < 11) setPhone((prev) => prev + num);
  };

  const handleBackspace = () => {
    if (!loading && phone.length > 0) setPhone((prev) => prev.slice(0, -1));
  };

  const handleLogin = async () => {
    if (loading) return; // prevent double presses
    if (!phone) {
      Alert.alert(
        i18n.language === "ur" ? "غلطی" : "Error",
        i18n.language === "ur" ? "براہ کرم فون نمبر درج کریں۔" : "Please enter phone number"
      );
      return;
    }

    const fullPhone = `+${callingCode}${phone.replace(/^0+/, "")}`;

    try {
      setLoading(true);
      const confirmation = await sendOtp(fullPhone);

      // Navigate to OTP screen
      navigation.navigate("FarmerOtp", { confirmation, phone: fullPhone });
    } catch (e) {
      console.error("Login error:", e);
      Alert.alert(
        i18n.language === "ur" ? "غلطی" : "Error",
        e.message || (i18n.language === "ur" ? "کچھ غلط ہو گیا۔" : "Something went wrong")
      );
    } finally {
      setLoading(false);
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
            gap: 15,
          }}
        >
          <Image
            source={require("../../images/logodark.png")}
            style={{ width: 300, height: 100, marginBottom: 20 }}
          />

          <Text style={{ fontSize: 28, fontWeight: "bold", color: "#006644", marginBottom: 10 }}>
            {t("farmerLogin.title")}
          </Text>
          <Text style={{ fontSize: 18, color: "#006644", marginBottom: 30 }}>
            {t("farmerLogin.subtitle")}
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowPad(true)}
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
            <Text style={{ color: "#006644", fontSize: 20, marginHorizontal: 8 }}>
              +{callingCode}
            </Text>
            <TextInput
              value={phone}
              placeholder={t("farmerLogin.phonePlaceholder")}
              placeholderTextColor="#006644"
              editable={false}
              style={{ flex: 1, fontSize: 20, color: "#006644" }}
            />
          </TouchableOpacity>

          {showPad && (
            <NumericPad
              onPressNumber={handlePress}
              onBackspace={handleBackspace}
              onSubmit={() => setShowPad(false)}
            />
          )}

          {/* Continue Button with loading */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              borderRadius: 10,
              backgroundColor: "#006644",
              alignItems: "center",
              marginBottom: 20,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" style={{ paddingVertical: 12 }} />
            ) : (
              <Text
                style={{
                  paddingVertical: 12,
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {t("farmerLogin.continue")}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={{ color: "#006644", fontSize: 20 }}>
            {t("farmerLogin.noAccount")}{" "}
            <Text
              style={{ fontWeight: "bold", fontSize: 20 }}
              onPress={() => navigation.navigate("FarmerSignup")}
            >
              {t("farmerLogin.signup")}
            </Text>
          </Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default FarmerLogin;
