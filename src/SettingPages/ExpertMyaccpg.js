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
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import { getExpertData, updateUserData, uploadImageToCloudinary } from "../Helper/firebaseHelper";

export default function ExpertMyAcc() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dpImage, setDpImage] = useState(null);
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const data = await getExpertData();
        if (data) {
          setName(data.name || "");
          setPhone(data.phoneNumber || "");
          setDpImage(data.dpImage || null);
          setQualification(data.qualification || "");
          setSpecialization(data.specialization || "");
          setExperience(data.experience || "");
        }
      } catch (error) {
        console.error("Error fetching expert data:", error);
        Alert.alert("Error", "Failed to load expert data.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
  }, []);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.7 }, async (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert("Error", response.errorMessage);
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
        } catch (err) {
          console.error(err);
          Alert.alert("Error", "Image upload failed!");
        } finally {
          setUploading(false);
        }
      }
    });
  };

  const handleSave = async () => {
    try {
      await updateUserData({
        name,
        phoneNumber: phone,
        dpImage,
        qualification,
        specialization,
        experience,
      });
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile.");
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 12,
            backgroundColor: "#006644",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={dpImage ? { uri: dpImage } : require("../images/a.png")}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
                {name || "No Name"}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}>
          {/* Profile Image */}
          <View style={{ alignSelf: "center", marginBottom: 20, position: "relative" }}>
            <Image
              source={dpImage ? { uri: dpImage } : require("../images/a.png")}
              style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: "#006644" }}
            />
            <TouchableOpacity
              onPress={handlePickImage}
              style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#006644", borderRadius: 15, padding: 5 }}
            >
              {uploading ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="photo-camera" size={20} color="#fff" />}
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text style={labelStyle}>Name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Enter name" style={inputStyle} />

          {/* Phone */}
          <Text style={labelStyle}>Phone Number</Text>
          <TextInput value={phone} onChangeText={setPhone} placeholder="Enter phone" keyboardType="phone-pad" style={inputStyle} />

          {/* Qualification */}
          <Text style={labelStyle}>Qualification</Text>
          <TextInput value={qualification} onChangeText={setQualification} placeholder="Enter qualification" style={inputStyle} />

          {/* Specialization */}
          <Text style={labelStyle}>Specialization</Text>
          <TextInput value={specialization} onChangeText={setSpecialization} placeholder="Enter specialization" style={inputStyle} />

          {/* Experience */}
          <Text style={labelStyle}>Experience</Text>
          <TextInput value={experience} onChangeText={setExperience} placeholder="Enter experience" keyboardType="numeric" style={inputStyle} />

          {/* Save Button */}
          <TouchableOpacity onPress={handleSave} style={saveBtnStyle}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const inputStyle = {
  backgroundColor: "#fff",
  borderRadius: 10,
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: "#ccc",
  marginBottom: 20,
};

const labelStyle = {
  fontSize: 14,
  fontWeight: "bold",
  color: "#006644",
  marginBottom: 5,
};

const saveBtnStyle = {
  backgroundColor: "#006644",
  paddingVertical: 12,
  borderRadius: 10,
  marginTop: 30,
  alignItems: "center",
  marginBottom: 30,
};
