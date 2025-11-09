import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { sendExpertOtp } from "../../Helper/firebaseHelper";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const ExpertSignup = ({ navigation }) => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("PK");
  const [callingCode, setCallingCode] = useState("92");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !qualification || !specialization || !experience || !phone) {
      Alert.alert(t("errors.fillAllFields"));
      return;
    }

    const fullPhone = `+${callingCode}${phone.replace(/^0+/, "")}`;

    try {
      setLoading(true);
      const confirmation = await sendExpertOtp(fullPhone);
      navigation.navigate("ExpertOtp", {
        phone: fullPhone,
        expertData: { name, qualification, specialization, experience },
        confirmation,
      });
    } catch (error) {
      Alert.alert(t("errors.error"), error.message);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              padding: 20,
            }}
            keyboardShouldPersistTaps="handled"
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
              {t("expertSignup.title")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#006644",
                marginBottom: 25,
                textAlign: "center",
              }}
            >
              {t("expertSignup.subtitle")}
            </Text>

            {/* Input Fields */}
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t("expertSignup.fullName")}
              placeholderTextColor="#006644"
              style={styles.input}
            />
            <TextInput
              value={qualification}
              onChangeText={setQualification}
              placeholder={t("expertSignup.qualification")}
              placeholderTextColor="#006644"
              style={styles.input}
            />
            <TextInput
              value={specialization}
              onChangeText={setSpecialization}
              placeholder={t("expertSignup.specialization")}
              placeholderTextColor="#006644"
              style={styles.input}
            />
            <TextInput
              value={experience}
              onChangeText={setExperience}
              placeholder={t("expertSignup.experience")}
              placeholderTextColor="#006644"
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Phone Input */}
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
                placeholder={t("expertSignup.phone")}
                placeholderTextColor="#006644"
                keyboardType="numeric"
                style={{ flex: 1, fontSize: 16, color: "#006644" }}
              />
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleSignup}
              style={[styles.button, loading && { opacity: 0.7 }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" style={{ paddingVertical: 12 }} />
              ) : (
                <Text style={styles.buttonText}>{t("expertSignup.continue")}</Text>
              )}
            </TouchableOpacity>

            {/* Login Option */}
            <Text style={{ color: "#006644", marginTop: 10 }}>
              {t("expertSignup.alreadyAccount")}{" "}
              <Text
                style={{ fontWeight: "bold", fontSize: 16 }}
                onPress={() => navigation.navigate("ExpertLogin")}
              >
                {t("expertSignup.login")}
              </Text>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = {
  input: {
    borderColor: "#006644",
    borderWidth: 2,
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 16,
    fontSize: 16,
    color: "#006644",
    backgroundColor: "rgba(255,255,255,0.9)", 
    marginBottom: 15,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#006644",
    borderWidth: 2,
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(255,255,255,0.9)", 
    marginBottom: 15,
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

export default ExpertSignup;
