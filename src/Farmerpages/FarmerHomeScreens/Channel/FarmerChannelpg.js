import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getChannels } from "../../../Helper/firebaseHelper";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
const ChannelsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getChannels();
      setChannels(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  // 🔍 Filter channels with search
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔖 Dummy "Followed" logic 
  const followedChannels = filteredChannels.filter((ch) => ch.isFollowed);
  const discoverChannels = filteredChannels.filter((ch) => !ch.isFollowed);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../../images/background.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/*  Top Section */}
        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 15,
            paddingBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#031501ff" }}>
            {t("channels.title")}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("SettingStack")}
          >
            <Icon name="settings" size={26} color="#031501ff" />
          </TouchableOpacity>
        </View>

        {/* 🔎 Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 25,
            paddingHorizontal: 15,
            marginHorizontal: 10,
            elevation: 2,
            height: 45,
          }}
        >
          <Icon name="search" size={20} color="#888" />
          <TextInput
            placeholder={t("channels.searchPlaceholder")}
            placeholderTextColor="#888"
            style={{ flex: 1, marginLeft: 8, color: "#000" }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* 📋 Channel Sections */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 10, marginTop: 10 }}>
          {/* ⭐ Followed Section */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#006644",
              marginVertical: 5,
            }}
          >
            {t("channels.following")}
          </Text>

          {followedChannels.length > 0 ? (
            followedChannels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                onPress={() =>
                  navigation.navigate("ChannelMsg", {
                    name: channel.name,
                    description: channel.description,
                    image: require("../../../images/chdummyimg.png"), // dynamic URL ho to { uri: channel.image }
                  })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 8,
                  elevation: 1,
                }}
              >
                <Image
                  source={require("../../../images/chdummyimg.png")}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "#000",
                    }}
                  >
                    {channel.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#555" }}>
                    {channel.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ margin: 10, color: "#555" }}>
              {t("channels.noFollowed")}
            </Text>
          )}

          {/* 🔍 Discover Section */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#006644",
              marginVertical: 5,
            }}
          >
            {t("channels.discover")}
          </Text>

          {discoverChannels.length > 0 ? (
            discoverChannels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                onPress={() =>
                  navigation.navigate("ChannelMsg", {
                    name: channel.name,
                    description: channel.description,
                    image: require("../../../images/chdummyimg.png"),
                  })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 8,
                  elevation: 1,
                }}
              >
                <Image
                  source={require("../../../images/chdummyimg.png")}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "#000",
                    }}
                  >
                    {channel.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#555" }}>
                    {channel.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ margin: 10, color: "#555" }}>
              {t("channels.noData")}
            </Text>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ChannelsScreen;
