import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  View,
  ActivityIndicator,
  Alert,Image
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setRole } from "../../redux/Slices/HomeDataSlice";
import { verifyExpertOtpAndSaveUser } from "../../Helper/firebaseHelper";
import { useTranslation } from "react-i18next";
import NumericPad from "../../Components/Numericpad";
import { SafeAreaView } from "react-native-safe-area-context";
const ExpertOtp = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { phone, expertData } = route.params;
  const confirmation = useSelector((state) => state.home.confirmation);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // ✅ NumericPad handlers
  const handlePress = (num) => {
    if (otp.length < 6) {
      setOtp(otp + num);
    }
  };

  const handleBackspace = () => {
    setOtp(otp.slice(0, -1));
  };

  const handleConfirm = async () => {
    if (otp.length < 6) {
      Alert.alert("Error", "Enter full 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      if (!confirmation) {
        Alert.alert("Error", "Confirmation not found. Please restart signup.");
        return;
      }

      const user = await verifyExpertOtpAndSaveUser(
        confirmation,
        otp,
        expertData
      );

      dispatch(setUser(user));
      dispatch(setRole("expert"));
      navigation.replace("EOtpSuccess");
    } catch (e) {
      console.error("OTP Verification Failed:", e);
      navigation.replace("EOtpFailure");
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
         <Image
                     source={require('../../images/logodark.png')}
                     style={{ width: 200, height: 100, marginBottom: 20 }}
                   />
         
                   <Text
                     style={{
                       fontSize: 20,
                       fontWeight: '600',
                       color: '#000',
                       textAlign: 'center',
                       marginBottom: 8,
                     }}
                   >
                     {t('expertOtp.title')}
                   </Text>
                   <Text style={{ color: '#555', textAlign: 'center', marginBottom: 30 }}>
                     {t('expertOtp.subtitle')}
                   </Text>

          {/* OTP Boxes without .map */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            <Text
              style={{
                borderWidth: 1,
                borderColor: "#006644",
                borderRadius: 8,
                width: 50,
                height: 50,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 18,
                backgroundColor: "#fff",
                marginHorizontal: 4,
              }}
            >
              {otp[0]}
            </Text>
            <Text
              style={{
                borderWidth: 1,
                borderColor: "#006644",
                borderRadius: 8,
                width: 50,
                height: 50,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 18,
                backgroundColor: "#fff",
                marginHorizontal: 4,
              }}
            >
              {otp[1]}
            </Text>
            <Text
              style={{
                borderWidth: 1,
                borderColor: "#006644",
                borderRadius: 8,
                width: 50,
                height: 50,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 18,
                backgroundColor: "#fff",
                marginHorizontal: 4,
              }}
            >
              {otp[2]}
            </Text>
            <Text
              style={{
                borderWidth: 1,
                borderColor: "#006644",
                borderRadius: 8,
                width: 50,
                height: 50,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 18,
                backgroundColor: "#fff",
                marginHorizontal: 4,
              }}
            >
              {otp[3]}
            </Text>
            <Text
              style={{
                borderWidth: 1,
                borderColor: "#006644",
                borderRadius: 8,
                width: 50,
                height: 50,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 18,
                backgroundColor: "#fff",
                marginHorizontal: 4,
              }}
            >
              {otp[4]}
            </Text>
            <Text
              style={{
                borderWidth: 1,
                borderColor: "#006644",
                borderRadius: 8,
                width: 50,
                height: 50,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 18,
                backgroundColor: "#fff",
                marginHorizontal: 4,
              }}
            >
              {otp[5]}
            </Text>
          </View>

          {/* Numeric Pad */}
          <NumericPad
            onPressNumber={handlePress}
            onBackspace={handleBackspace}
          />

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#999" : "#006644",
              padding: 15,
              borderRadius: 8,
              alignItems: "center",
              width: "60%",
              marginTop: 20,
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
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertOtp;
