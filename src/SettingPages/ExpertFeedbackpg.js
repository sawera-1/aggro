import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useTranslation } from "react-i18next";

export default function ExpertFeedback({ navigation, route }) {
  const { t } = useTranslation();
  const currentUserId = auth().currentUser?.uid;

  const {
    reportedUser, // optional: full user object
    channelId,
    channelName,
    channelImage,
    channelDescription,
    dateCreated,
    createdBy,
  } = route.params || {};

  const [stars, setStars] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStarPress = (value) => setStars(value);

  const handleSubmit = async () => {
    if (!currentUserId) {
      Alert.alert(t("exFeedback.error"), t("exFeedback.loginToReport"));
      return;
    }

    if (stars === 0) {
      Alert.alert(t("exFeedback.error"), t("exFeedback.selectStar"));
      return;
    }

    if (!feedbackText.trim()) {
      Alert.alert(t("exFeedback.error"), t("exFeedback.writeFeedback"));
      return;
    }

    setLoading(true);

    try {
      const payload = {
        reporterUserId: currentUserId,
        rating: stars,
        content: feedbackText,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      if (reportedUser) {
        // Reporting a user
        payload.reportedUserId = reportedUser.uid;
        payload.reportedUserName = reportedUser.name;
        payload.reportedUserPhone = reportedUser.phoneNumber;
        payload.reportedUserDp = reportedUser.dpImage || null;
        payload.type = "user";
      } else if (channelId) {
        // Reporting a channel
        payload.channelId = channelId;
        payload.channelName = channelName;
        payload.channelImage = channelImage || null;
        payload.channelDescription = channelDescription || null;
        payload.channelCreatedBy = createdBy;
        payload.type = "channel";
      }

      await firestore().collection("feedbacks").add(payload);

      Alert.alert(t("exFeedback.success"), t("exFeedback.thanks"));
      setStars(0);
      setFeedbackText("");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert(t("exFeedback.error"), t("exFeedback.submitFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#006644" />
      </SafeAreaView>
    );
  }

  const showHeaderImage = reportedUser ? reportedUser.dpImage : channelImage;
  const showHeaderName = reportedUser ? reportedUser.name : channelName;
  const showHeaderSubtitle = reportedUser ? reportedUser.phoneNumber : channelDescription;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../images/background.jpg")}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.9 }}
      >
        {/* Top Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 15,
            backgroundColor: "#006644",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={showHeaderImage ? { uri: showHeaderImage } : require("../images/a.png")}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
          />
          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
              {showHeaderName || t("exFeedback.noName")}
            </Text>
            <Text style={{ color: "#fff", fontSize: 13 }}>
              {showHeaderSubtitle || t("exFeedback.noPhone")}
            </Text>
          </View>
        </View>

        {/* Feedback Form */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: 20,
              borderRadius: 15,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#333" }}>
              {channelId ? t("exFeedback.reportChannel") : t("exFeedback.reportUser")}
            </Text>

            {/* Stars */}
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity key={index} onPress={() => handleStarPress(index + 1)}>
                  <Icon
                    name={index < stars ? "star" : "star-border"}
                    size={32}
                    color="#FFD700"
                    style={{ marginHorizontal: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback TextArea */}
            <TextInput
              style={{
                width: "100%",
                height: 120,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                textAlignVertical: "top",
                marginBottom: 15,
                backgroundColor: "#fff",
                color: "#000",
              }}
              placeholder={t("exFeedback.writeFeedbackPlaceholder")}
              placeholderTextColor="#888"
              multiline
              value={feedbackText}
              onChangeText={setFeedbackText}
            />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={{ backgroundColor: "#006644", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                {t("exFeedback.submit")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
