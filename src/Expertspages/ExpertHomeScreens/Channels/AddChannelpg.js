import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
export default function CreateChannel({ navigation }) {
  const { t } = useTranslation();
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [channelImage, setChannelImage] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../../images/background.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* 🔹 Top Bar with Back Arrow */}
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
            {t("createChannel.title")}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Channel Name */}
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            {t("createChannel.channelName")}
          </Text>
          <TextInput
            value={channelName}
            onChangeText={setChannelName}
            placeholder={t("createChannel.channelNamePlaceholder")}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              padding: 12,
              marginBottom: 15,
              backgroundColor: "#fff",
            }}
          />

          {/* Channel Description */}
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            {t("createChannel.description")}
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t("createChannel.descriptionPlaceholder")}
            multiline
            numberOfLines={4}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
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
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Icon name="photo-camera" size={32} color="#006644" />
              <Text
                style={{
                  marginTop: 6,
                  color: "#006644",
                  fontWeight: "500",
                }}
              >
                {t("createChannel.upload")}
              </Text>
            </View>
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
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {t("createChannel.createButton")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
