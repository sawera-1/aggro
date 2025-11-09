import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import { getUserData, updateUserData, uploadImageToCloudinary } from "../Helper/firebaseHelper";

export default function FarmerMyAcc() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dpImage, setDpImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        if (data) {
          setName(data.name || "");
          setPhone(data.phoneNumber || "");
          setDpImage(data.dpImage || null);
        }
      } catch (error) {
        console.error(t("farmerMyaccount.errorFetchingUser"), error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Pick Image + Upload
  const handlePickImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.7 }, async (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert(t("farmerMyaccount.error"), response.errorMessage);
        return;
      }

      const asset = response.assets?.[0];
      if (asset?.uri) {
        try {
          setUploading(true);
          const uploadedUrl = await uploadImageToCloudinary({
            uri: asset.uri,
            type: asset.type || "image/jpeg",
            name: asset.fileName || "profile.jpg",
          });
          setDpImage(uploadedUrl);
          await updateUserData({ dpImage: uploadedUrl });
          Alert.alert(t("farmerMyaccount.success"), t("farmerMyaccount.profilePicUpdated"));
        } catch (err) {
          console.error(err);
          Alert.alert(t("farmerMyaccount.error"), t("farmerMyaccount.imageUploadFailed"));
        } finally {
          setUploading(false);
        }
      }
    });
  };

  const handleSave = async () => {
    try {
      await updateUserData({ name, phoneNumber: phone, dpImage });
      Alert.alert(t("farmerMyaccount.success"), t("farmerMyaccount.profileUpdated"));
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert(t("farmerMyaccount.error"), t("farmerMyaccount.profileUpdateFailed"));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#006644" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../images/background.jpg")}
        style={{ flex: 1 }}
        imageStyle={{ resizeMode: "cover", opacity: 0.9 }}
      >
        {/* Top Bar */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 12, backgroundColor: "#006644" }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={dpImage ? { uri: dpImage } : require("../images/a.png")} style={{ width: 50, height: 50, borderRadius: 25 }} />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
                {name || t("farmerMyaccount.noName")}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}>
          {/* Profile Image */}
          <View style={{ alignSelf: "center", marginBottom: 20, position: "relative" }}>
            <Image source={dpImage ? { uri: dpImage } : require("../images/a.png")} style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: "#006644" }} />
            <TouchableOpacity onPress={handlePickImage} style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#006644", borderRadius: 15, padding: 5 }}>
              {uploading ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="photo-camera" size={20} color="#fff" />}
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text style={{ fontSize: 14, fontWeight: "bold", color: "#006644", marginBottom: 5 }}>
            {t("farmerMyaccount.nameLabel")}
          </Text>
          <TextInput value={name} onChangeText={setName} placeholder={t("farmerMyaccount.namePlaceholder")} style={{ backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 20 }} />

          {/* Phone */}
          <Text style={{ fontSize: 14, fontWeight: "bold", color: "#006644", marginBottom: 5 }}>
            {t("farmerMyaccount.phoneLabel")}
          </Text>
          <TextInput value={phone} onChangeText={setPhone} placeholder={t("farmerMyaccount.phonePlaceholder")} keyboardType="phone-pad" style={{ backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, borderWidth: 1, borderColor: "#ccc" }} />

          {/* Save Button */}
          <TouchableOpacity onPress={handleSave} style={{ backgroundColor: "#006644", paddingVertical: 12, borderRadius: 10, marginTop: 30, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {t("farmerMyaccount.saveBtn")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
