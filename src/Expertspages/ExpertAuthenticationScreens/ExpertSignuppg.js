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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CountryPicker from "react-native-country-picker-modal";
import { useDispatch } from "react-redux";
import { setConfirmation } from "../../redux/Slices/HomeDataSlice";
import { sendExpertOtp } from "../../Helper/firebaseHelper";
import { useTranslation } from "react-i18next";  // ✅ import
import { SafeAreaView } from "react-native-safe-area-context";
const ExpertSignup = ({ navigation }) => {
  const { t } = useTranslation();  // ✅ translation hook

  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Country Picker states
  const [countryCode, setCountryCode] = useState("PK"); // Default Pakistan
  const [callingCode, setCallingCode] = useState("92");

  const dispatch = useDispatch();

  const handleSignup = async () => {
    if (!name || !qualification || !specialization || !experience || !phone || !password) {
      Alert.alert(t("errors.fillAllFields")); 
      return;
    }

    const fullPhone = `+${callingCode}${phone.replace(/^0+/, "")}`;

    try {
      setLoading(true);
      const confirmation = await sendExpertOtp(fullPhone);

      dispatch(setConfirmation(confirmation));

      navigation.navigate("ExpertOtp", {
        phone: fullPhone,
        expertData: { name, qualification, specialization, experience, password },
      });
    } catch (e) {
      Alert.alert(t("errors.error"), e.message); 
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
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "#006644", marginBottom: 10 }}>
            {t("expertSignup.title")}
          </Text>
          <Text style={{ fontSize: 14, color: "#006644", marginBottom: 25 }}>
            {t("expertSignup.subtitle")}
          </Text>

          {/* Full Name */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t("expertSignup.fullName")}   // ✅ translated placeholder
            placeholderTextColor="#006644"
            style={styles.input}
          />

          {/* Qualification */}
          <TextInput
            value={qualification}
            onChangeText={setQualification}
            placeholder={t("expertSignup.qualification")}
            placeholderTextColor="#006644"
            style={styles.input}
          />

          {/* Specialization */}
          <TextInput
            value={specialization}
            onChangeText={setSpecialization}
            placeholder={t("expertSignup.specialization")}
            placeholderTextColor="#006644"
            style={styles.input}
          />

          {/* Experience */}
          <TextInput
            value={experience}
            onChangeText={setExperience}
            placeholder={t("expertSignup.experience")}
            placeholderTextColor="#006644"
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Phone with Country Picker */}
          <View style={styles.phoneContainer}>
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withModal
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
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

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("expertSignup.password")}
              placeholderTextColor="#006644"
              secureTextEntry={!showPassword}
              style={{ flex: 1, fontSize: 16, color: "#006644" }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#006644" />
            </TouchableOpacity>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            style={{
              width: "100%",
              borderRadius: 10,
              backgroundColor: "#006644",
              alignItems: "center",
              marginBottom: 20,
              opacity: loading ? 0.6 : 1,
            }}
            disabled={loading}
          >
            <Text style={{ paddingVertical: 12, color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {loading ? t("expertSignup.continue") : t("expertSignup.continue")}
            </Text>
          </TouchableOpacity>

          {/* Login Redirect */}
          <Text style={{ color: "#006644" }}>
            {t("expertSignup.alreadyAccount")}{" "}
            <Text
              style={{ fontWeight: "bold", fontSize: 18 }}
              onPress={() => navigation.navigate("ExpertLogin")}
            >
              {t("expertSignup.login")}
            </Text>
          </Text>
        </ScrollView>
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
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 16,
    fontSize: 16,
    color: "#006644",
    marginBottom: 15,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#006644",
    borderWidth: 2,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#006644",
    borderWidth: 2,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
};

export default ExpertSignup;
