import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { verifyExpertOtpAndSaveUser } from "../../Helper/firebaseHelper";
import NumericPad from "../../Components/Numericpad";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const ExpertSignupOtp = ({ navigation, route }) => {
  const { phone, confirmation, expertData } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handlePress = (num) => {
    if (otp.length < 6) setOtp((prev) => prev + num);
  };

  const handleBackspace = () => setOtp((prev) => prev.slice(0, -1));

  const handleConfirm = async () => {
    if (otp.length < 6) return Alert.alert(t("expertOtp.error"), t("expertOtp.enterFullOtp"));
    try {
      setLoading(true);
      await verifyExpertOtpAndSaveUser(confirmation, otp, expertData);
      navigation.replace("ExpertOtpSuccess");
    } catch (e) {
      console.error(e);
      navigation.replace("ExpertOtpFailure");
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
              textAlign: "center",
            }}
          >
            {t("expertOtp.title")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#006644",
              marginBottom: 25,
              textAlign: "center",
            }}
          >
            {t("expertOtp.subtitle", { phone })}
          </Text>

          {/* OTP line inputs */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "80%",
              marginBottom: 30,
            }}
          >
            {[...Array(6)].map((_, i) => (
              <TextInput
                key={i}
                value={otp[i] || ""}
                style={{
                  borderBottomWidth: 2,
                  borderColor: "#006644",
                  width: 40,
                  textAlign: "center",
                  fontSize: 20,
                  color: "#006644",
                  fontWeight: "bold",
                }}
                editable={false}
              />
            ))}
          </View>

          {/* Numeric pad */}
          <NumericPad onPressNumber={handlePress} onBackspace={handleBackspace} />

          {/* Confirm button with loading */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={loading}
            style={{
              width: "100%",
              borderRadius: 10,
              backgroundColor: "#006644",
              alignItems: "center",
              marginTop: 20,
              paddingVertical: 14,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                {t("expertOtp.confirm")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Resend or Edit phone */}
          <Text
            style={{
              color: "#006644",
              marginTop: 15,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {t("expertOtp.notReceived")}{" "}
            <Text
              style={{ fontWeight: "bold", fontSize: 16 }}
              onPress={() => navigation.goBack()}
            >
              {t("expertOtp.editPhone")}
            </Text>
          </Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertSignupOtp;
