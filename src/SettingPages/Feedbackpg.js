import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";

export default function FeedbackPage({ navigation }) {
  const { t } = useTranslation();

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
            paddingVertical: 15,
            backgroundColor: "#006644",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={require("../images/a.png")}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
          />
          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}> {t("feedback.userName")}</Text>
            <Text style={{ color: "#fff", fontSize: 13 }}>{t("feedback.userPhone")}</Text>
          </View>
        </View>

        {/* Content */}
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
            {/* Heading */}
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#333" }}>
              {t("feedback.title")}
            </Text>

            {/* Stars */}
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity key={index}>
                  <Icon name="star-border" size={32} color="#FFD700" style={{ marginHorizontal: 4 }} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback Text Area */}
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
              }}
              placeholder={t("feedback.placeholder")}
              placeholderTextColor="#555"
              multiline
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#006644",
                paddingVertical: 12,
                paddingHorizontal: 30,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                {t("feedback.submit")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
