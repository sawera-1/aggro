import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { sendOtp } from "../../Helper/firebaseHelper";
import NumericPad from "../../Components/Numericpad";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const ExpertLogin = ({ navigation }) => {
  const { t } = useTranslation();

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("PK");
  const [callingCode, setCallingCode] = useState("92");
  const [showPad, setShowPad] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePress = (num) => {
    if (phone.length < 11) setPhone((prev) => prev + num);
  };

  const handleBackspace = () => setPhone((prev) => prev.slice(0, -1));

  const handleLogin = async () => {
    if (!phone) {
      return Alert.alert(t("expertLogin.enterPhone"));
    }

    const fullPhone = `+${callingCode}${phone.replace(/^0+/, "")}`;

    try {
      setLoading(true);
      const confirmation = await sendOtp(fullPhone);
      navigation.navigate("ExpertloginOtp", { phone: fullPhone, confirmation });
    } catch (e) {
      Alert.alert(t("expertLogin.error"), e.message);
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
          }}
        >
          {/* Logo */}
          <Image
            source={require("../../images/logodark.png")}
            style={{ width: 280, height: 90, marginBottom: 25 }}
          />

          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#006644",
              marginBottom: 10,
            }}
          >
            {t("expertLogin.title")}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#006644",
              marginBottom: 25,
              textAlign: "center",
            }}
          >
            {t("expertLogin.subtitle")}
          </Text>

          {/* Phone input */}
          <View style={styles.phoneContainer}>
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withModal
              onSelect={(c) => {
                setCountryCode(c.cca2);
                setCallingCode(c.callingCode[0]);
              }}
            />
            <Text style={{ color: "#006644", fontSize: 16, marginHorizontal: 8 }}>
              +{callingCode}
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={{ flex: 1, fontSize: 16, color: "#006644" }}
              placeholder={t("expertLogin.phonePlaceholder")}
              placeholderTextColor="#006644"
            />
          </View>

          {/* Numeric pad */}
          {showPad && (
            <NumericPad
              onPressNumber={handlePress}
              onBackspace={handleBackspace}
              onSubmit={() => setShowPad(false)}
            />
          )}

          {/* Login button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.button, loading && { opacity: 0.7 }]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" style={{ paddingVertical: 12 }} />
            ) : (
              <Text style={styles.buttonText}>{t("expertLogin.continue")}</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up */}
          <Text style={{ color: "#006644", marginTop: 10 }}>
            {t("expertLogin.noAccount")}{" "}
            <Text
              style={{ fontWeight: "bold", fontSize: 16 }}
              onPress={() => navigation.navigate("ExpertSignup")}
            >
              {t("expertLogin.signup")}
            </Text>
          </Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = {
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#006644",
    borderWidth: 2,
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  button: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#006644",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
};

export default ExpertLogin;
