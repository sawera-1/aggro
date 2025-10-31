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
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";


const ChannelsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const userId = auth().currentUser?.uid;

  // Fetch all channels + followed channels
const fetchChannels = async () => {
  try {
    setLoading(true);

    const [allSnap, followSnap] = await Promise.all([
      firestore().collection("channels").get(),
      firestore()
        .collection("users")
        .doc(userId)
        .collection("followedChannels")
        .get(),
    ]);

    // Get all channels
    const allChannels = allSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      image: doc.data().imageUrl || "", // ✅ use imageUrl field directly
    }));

    // Get followed channel IDs
    const followedIds = followSnap.docs.map((doc) => doc.id);

    // Merge followed info
    const merged = allChannels.map((channel) => ({
      ...channel,
      isFollowed: followedIds.includes(channel.id),
    }));

    setChannels(merged);
  } catch (err) {
    console.error("Error fetching channels:", err);
    Alert.alert("Error", "Failed to load channels");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchChannels();
  }, []);



  
  // Follow channel
  const handleFollow = async (channel) => {
  try {
    await firestore()
      .collection("users")
      .doc(userId)
      .collection("followedChannels")
      .doc(channel.id)
      .set({
        name: channel.name,
        image: channel.image || "",
        followedAt: firestore.FieldValue.serverTimestamp(), // ✅ timestamp
      });
    fetchChannels(); // refresh UI
  } catch (err) {
    Alert.alert("Error", "Failed to follow channel");
  }
};


  // Unfollow channel
  const handleUnfollow = async (channel) => {
    try {
      await firestore()
        .collection("users")
        .doc(userId)
        .collection("followedChannels")
        .doc(channel.id)
        .delete();
      fetchChannels();
    } catch (err) {
      Alert.alert("Error", "Failed to unfollow channel");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  const filtered = channels.filter((ch) =>
    ch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const followed = filtered.filter((ch) => ch.isFollowed);
  const discover = filtered.filter((ch) => !ch.isFollowed);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../../images/background.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* Header */}
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
            Channels
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SettingStack")}>
            <Icon name="settings" size={26} color="#031501ff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
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
            placeholder="Search Channels"
            placeholderTextColor="#888"
            style={{ flex: 1, marginLeft: 8, color: "#000" }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Sections */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 10, marginTop: 10 }}>
          {/* Followed Section */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#006644",
              marginVertical: 5,
            }}
          >
            Following
          </Text>

          {followed.length > 0 ? (
            followed.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onPress={() =>
  navigation.navigate("ChannelMsg", {
    channelId: channel.id,      
    channelData: channel,        
  })
                }
                buttonTitle="Unfollow"
                buttonColor="#ff9900"
                onButtonPress={() => handleUnfollow(channel)}
              />
            ))
          ) : (
            <Text style={{ margin: 10, color: "#555" }}>
              You are not following any channels.
            </Text>
          )}

          {/* Discover Section */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#006644",
              marginVertical: 5,
            }}
          >
            Discover
          </Text>

          {discover.length > 0 ? (
            discover.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onPress={() =>
                  navigation.navigate("ChannelMsg", {
                    name: channel.name,
                    description: channel.description,
                    image: channel.image
                      ? { uri: channel.image }
                      : require("../../../images/chdummyimg.png"),
                  })
                }
                buttonTitle="Follow"
                buttonColor="#006644"
                onButtonPress={() => handleFollow(channel)}
              />
            ))
          ) : (
            <Text style={{ margin: 10, color: "#555" }}>
              No channels to discover.
            </Text>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Reusable card component
const ChannelCard = ({ channel, onPress, buttonTitle, buttonColor, onButtonPress }) => (
  <View
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
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
    >
      <Image
        source={
          channel.image
            ? { uri: channel.image }
            : require("../../../images/chdummyimg.png")
        }
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15, color: "#000" }}>
          {channel.name}
        </Text>
        <Text style={{ fontSize: 12, color: "#555" }}>
          {channel.description}
        </Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        backgroundColor: buttonColor,
        paddingVertical: 6,
        paddingHorizontal: 18,
        borderRadius: 8,
      }}
      onPress={onButtonPress}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>{buttonTitle}</Text>
    </TouchableOpacity>
  </View>
);

export default ChannelsScreen;
