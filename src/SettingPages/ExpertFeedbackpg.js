import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserData } from "../Helper/firebaseHelper"; 

export default function ExpertFeedback({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserData();
      setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#006644" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require("../images/background.jpg")} style={{ flex: 1 }} imageStyle={{ opacity: 0.9 }}>
        
        {/* Top Bar with user data */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 15, backgroundColor: "#006644" }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={user?.dpImage ? { uri: user.dpImage } : require("../images/a.png")}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
          />
          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
              {user?.name || "No Name"}
            </Text>
            <Text style={{ color: "#fff", fontSize: 13 }}>
              {user?.phoneNumber || "No Phone"}
            </Text>
          </View>
        </View>

        {/* Feedback Form */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <View style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", padding: 20, borderRadius: 15, width: "100%", alignItems: "center" }}>
            
            {/* Heading */}
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#333" }}>
              Feedback
            </Text>

            {/* Stars */}
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity key={index}>
                  <Icon name="star-border" size={32} color="#FFD700" style={{ marginHorizontal: 4 }} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback TextArea */}
            <TextInput
              style={{ width: "100%", height: 120, borderColor: "#ccc", borderWidth: 1, borderRadius: 10, padding: 10, textAlignVertical: "top", marginBottom: 15, backgroundColor: "#fff" }}
              placeholder="Write your feedback..."
              multiline
            />

            {/* Submit Button */}
            <TouchableOpacity style={{ backgroundColor: "#006644", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 }}>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
