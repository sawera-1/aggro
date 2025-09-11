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
import { setUser, setRole } from "../../redux/Slices/HomeDataSlice";
import { getExpertByPhoneAndPassword } from "../../Helper/firebaseHelper";
import { SafeAreaView } from "react-native-safe-area-context";
const ExpertLogin = ({ navigation }) => {
  const dispatch = useDispatch();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Country picker states
  const [countryCode, setCountryCode] = useState("PK"); // default Pakistan
  const [callingCode, setCallingCode] = useState("92");

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const fullPhone = `+${callingCode}${phoneNumber.replace(/^0+/, "")}`;

    try {
      setLoading(true);
      const userData = await getExpertByPhoneAndPassword(fullPhone, password);

      if (!userData) {
        Alert.alert("Login Failed", "Invalid phone number or password");
        navigation.replace("ExpertloginFailure");
        return;
      }

      // ✅ Save user in Redux
      dispatch(setUser(userData));
      dispatch(setRole("expert"));

      navigation.replace("ExpertloginSuccess");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
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
            style={{ width: 250, height: 80, marginBottom: 30 }}
          />

          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#006644",
              marginBottom: 30,
            }}
          >
            Expert Login
          </Text>

          {/* Country Picker + Phone Input */}
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
              marginBottom: 15,
            }}
          >
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withEmoji
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
            />
            <Text style={{ marginHorizontal: 8, fontSize: 16, color: "#006644" }}>
              +{callingCode}
            </Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              placeholderTextColor="#006644"
              style={{
                flex: 1,
                fontSize: 16,
                color: "#006644",
                paddingVertical: 0,
              }}
            />
          </View>

          {/* Password */}
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
              paddingVertical: 5,
              marginBottom: 15,
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#006644"
              secureTextEntry={!showPassword}
              style={{ flex: 1, fontSize: 16, color: "#006644" }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#006644"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              width: "100%",
              borderRadius: 10,
              backgroundColor: "#006644",
              alignItems: "center",
              marginBottom: 15,
              opacity: loading ? 0.6 : 1,
            }}
            disabled={loading}
          >
            <Text
              style={{
                paddingVertical: 12,
                color: "#ffffff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => {
              if (!phoneNumber) {
                Alert.alert("Error", "Please enter your phone number first");
                return;
              }
              navigation.navigate("ExpertpasswordOtp", {
                phone: `+${callingCode}${phoneNumber.replace(/^0+/, "")}`,
              });
            }}
          >
            <Text
              style={{
                color: "#006644",
                marginBottom: 20,
                fontSize: 16,
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Signup */}
          <Text style={{ color: "#006644" }}>
            Don’t have an account?{" "}
            <Text
              style={{ fontWeight: "bold", fontSize: 16 }}
              onPress={() => navigation.navigate("ExpertSignup")}
            >
              Signup
            </Text>
          </Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertLogin;
