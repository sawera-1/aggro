import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { verifyOtpForLogin } from "../../Helper/firebaseHelper";
import NumericPad from "../../Components/Numericpad";
import { SafeAreaView } from "react-native-safe-area-context";

const ExpertLoginOtp = ({ navigation, route }) => {
  const { confirmation, phone } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePress = (num) => {
    if (otp.length < 6) setOtp((prev) => prev + num);
  };

  const handleBackspace = () => setOtp((prev) => prev.slice(0, -1));

  const handleConfirm = async () => {
    if (otp.length < 6) return Alert.alert("Enter OTP");
    try {
      setLoading(true);
      await verifyOtpForLogin(confirmation, otp);
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
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "#006644", marginBottom: 10 }}>
            Enter OTP
          </Text>
          <Text style={{ fontSize: 14, color: "#006644", marginBottom: 25, textAlign: "center" }}>
            We have sent an OTP to {phone}
          </Text>

          {/* OTP line inputs */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "80%", marginBottom: 30 }}>
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
          <NumericPad
            onPressNumber={handlePress}
            onBackspace={handleBackspace}
          />

          {/* Confirm button */}
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
                Confirm
              </Text>
            )}
          </TouchableOpacity>

          {/* Bottom text */}
          <Text style={{ color: "#006644", marginTop: 15, fontSize: 14, textAlign: "center" }}>
            Didn't receive OTP?{" "}
            <Text
              style={{ fontWeight: "bold", fontSize: 16 }}
              onPress={() => navigation.goBack()}
            >
              Edit Phone
            </Text>
          </Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertLoginOtp;
