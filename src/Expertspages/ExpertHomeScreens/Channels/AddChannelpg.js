import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function CreateChannel({ navigation }) {
  const { t } = useTranslation();
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [channelImage, setChannelImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Cloudinary config
  const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // replace with your preset
  const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME"; // replace with your cloud name

  const handlePickImage = () => {
    Alert.alert(
      t("createChannel.selectImage") || "Select Image",
      "",
      [
        { text: t("createChannel.camera") || "Camera", onPress: pickFromCamera },
        { text: t("createChannel.gallery") || "Gallery", onPress: pickFromGallery },
        { text: t("createChannel.cancel") || "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const pickFromGallery = async () => {
    const result = await launchImageLibrary({ mediaType: "photo", quality: 0.8 });
    if (result?.assets && result.assets.length > 0) {
      setChannelImage(result.assets[0]);
    }
  };

  const pickFromCamera = async () => {
    const result = await launchCamera({ mediaType: "photo", quality: 0.8 });
    if (result?.assets && result.assets.length > 0) {
      setChannelImage(result.assets[0]);
    }
  };

  // Cloudinary image upload
  // Cloudinary image upload
const uploadImageToCloudinary = async (asset) => {
  if (!asset?.uri) return "";

  const data = new FormData();
  data.append("file", {
    uri: asset.uri,
    name: asset.fileName || `channel_${Date.now()}.jpg`,
    type: asset.type || "image/jpeg",
  });

  // Use your actual Cloudinary upload preset
  data.append("upload_preset", "react_native_uploads");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dumgs9cp4/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();

    if (json.secure_url) return json.secure_url;
    throw new Error(json.error?.message || "Image upload failed");
  } catch (err) {
    console.log("Cloudinary Upload Error:", err);
    throw err;
  }
};

  const handleCreateChannel = async () => {
  if (!channelName.trim() || !description.trim()) {
    Alert.alert(
      t("createChannel.error") || "Error",
      t("createChannel.requiredFields") || "Channel name and description are required."
    );
    return;
  }
  setUploading(true);
  try {
    let imageUrl = "";
    if (channelImage) {
      imageUrl = await uploadImageToCloudinary(channelImage);
    }
    const user = auth().currentUser;
    const channelData = {
      name: channelName.trim(),
      description: description.trim(),
      imageUrl: imageUrl || "",
      createdBy: user?.uid, // <-- FIXED FIELD NAME
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    await firestore().collection("channels").add(channelData);
    setUploading(false);
    setChannelName("");
    setDescription("");
    setChannelImage(null);
    navigation.navigate("ExpertChannel"); // adjust route name if needed
  } catch (err) {
    setUploading(false);
    Alert.alert(
      t("createChannel.error") || "Error",
      err.message || t("createChannel.errorUploading") || "Failed to create channel."
    );
  }
};
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../../images/background.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* Top Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 12,
            backgroundColor: "#006644",
            borderBottomWidth: 1,
            borderColor: "#006644",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              marginLeft: 15,
            }}
          >
            {t("createChannel.title") || "Create Channel"}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Channel Name */}
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            {t("createChannel.channelName") || "Channel Name"}
          </Text>
          <TextInput
            value={channelName}
            onChangeText={setChannelName}
            placeholder={t("createChannel.channelNamePlaceholder") || "Enter channel name"}
            placeholderTextColor="#888"
            style={{
              borderWidth: 1,
              borderColor: "#006644",
              borderRadius: 10,
              padding: 12,
              marginBottom: 15,
              backgroundColor: "#fff",
            }}
          />

          {/* Channel Description */}
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            {t("createChannel.description") || "Description"}
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t("createChannel.descriptionPlaceholder") || "Enter description"}
            placeholderTextColor="#888"
            multiline
            numberOfLines={4}
            style={{
              borderWidth: 1,
              borderColor: "#006644",
              borderRadius: 10,
              padding: 12,
              marginBottom: 15,
              backgroundColor: "#fff",
              textAlignVertical: "top",
            }}
          />

          {/* Upload Image Button */}
          <TouchableOpacity
            style={{
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#f6fff9",
              borderWidth: 2,
              borderColor: "#006644",
              borderStyle: "dashed",
              marginBottom: 20,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              overflow: "hidden",
            }}
            onPress={handlePickImage}
          >
            {channelImage?.uri ? (
              <Image
                source={{ uri: channelImage.uri }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Icon name="photo-camera" size={32} color="#006644" />
                <Text
                  style={{
                    marginTop: 6,
                    color: "#006644",
                    fontWeight: "500",
                  }}
                >
                  {t("createChannel.upload") || "Upload"}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Create Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#006644",
              padding: 15,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 10,
              elevation: 3,
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={handleCreateChannel}
            disabled={uploading}
          >
            {uploading && (
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
            )}
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {t("createChannel.createButton") || "Create"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}