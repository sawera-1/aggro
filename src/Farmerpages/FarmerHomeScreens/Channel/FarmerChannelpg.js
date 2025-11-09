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
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

const ChannelsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = auth().currentUser?.uid;

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const [allSnap, followSnap] = await Promise.all([
        firestore().collection("channels").get(),
        firestore().collection("users").doc(userId).collection("followedChannels").get(),
      ]);

      const allChannels = allSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        image: doc.data().imageUrl || "",
      }));

      const followedMeta = followSnap.docs.reduce((acc, d) => {
        acc[d.id] = { followedAt: d.data()?.followedAt?.toDate?.() || null };
        return acc;
      }, {});
      const followedIds = Object.keys(followedMeta);

      let merged = allChannels.map(channel => ({
        ...channel,
        isFollowed: followedIds.includes(channel.id),
        unreadCount: 0,
      }));

      // Compute unread counts for followed channels
      const computePromises = merged
        .filter(ch => ch.isFollowed)
        .map(async ch => {
          try {
            const since = followedMeta[ch.id]?.followedAt;
            const snap = await firestore()
              .collection('channels')
              .doc(ch.id)
              .collection('messages')
              .orderBy('createdAt', 'desc')
              .limit(50)
              .get();

            const unread = snap.docs.reduce((count, d) => {
              const m = d.data();
              const createdAt = m.createdAt?.toDate?.() || null;
              const isAfterFollow = since ? (!createdAt || createdAt >= since) : true;
              const readBy = m.readBy || {};
              const isOwn = m.senderId === userId;
              const isRead = !!readBy[userId];
              return count + (isAfterFollow && !isOwn && !isRead ? 1 : 0);
            }, 0);

            ch.unreadCount = unread;
          } catch (_) {}
          return ch;
        });

      const withUnread = await Promise.all(computePromises);
      const unreadMap = withUnread.reduce((acc, c) => { acc[c.id] = c.unreadCount; return acc; }, {});
      merged = merged.map(c => ({ ...c, unreadCount: unreadMap[c.id] ?? c.unreadCount }));

      setChannels(merged);
    } catch (err) {
      console.error("Error fetching channels:", err);
      Alert.alert(t("channelsScreen.title"), t("channelsScreen.errorLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChannels(); }, []);
  useFocusEffect(React.useCallback(() => { fetchChannels(); }, []));

  const handleFollow = async (channel) => {
    try {
      await firestore().collection("users").doc(userId).collection("followedChannels").doc(channel.id).set({
        name: channel.name,
        image: channel.image || "",
        followedAt: firestore.FieldValue.serverTimestamp(),
      });
      fetchChannels();
    } catch (err) {
      Alert.alert(t("channelsScreen.title"), t("channelsScreen.errorFollow"));
    }
  };

  const handleUnfollow = async (channel) => {
    try {
      await firestore().collection("users").doc(userId).collection("followedChannels").doc(channel.id).delete();
      fetchChannels();
    } catch (err) {
      Alert.alert(t("channelsScreen.title"), t("channelsScreen.errorUnfollow"));
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  const filtered = channels.filter(ch => ch.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const followed = filtered.filter(ch => ch.isFollowed);
  const discover = filtered.filter(ch => !ch.isFollowed);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require("../../../images/background.jpg")} style={{ flex: 1 }} resizeMode="cover">
        {/* Header */}
        <View style={{ paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#031501ff" }}>{t("channelsScreen.title")}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SettingStack")}>
            <Icon name="settings" size={26} color="#031501ff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 25, paddingHorizontal: 15, marginHorizontal: 10, elevation: 2, height: 45 }}>
          <Icon name="search" size={20} color="#888" />
          <TextInput
            placeholder={t("channelsScreen.searchPlaceholder")}
            placeholderTextColor="#888"
            style={{ flex: 1, marginLeft: 8, color: "#000" }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView style={{ flex: 1, paddingHorizontal: 10, marginTop: 10 }}>
          {/* Followed Section */}
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#006644", marginVertical: 5 }}>{t("channelsScreen.following")}</Text>
          {followed.length > 0 ? followed.map(channel => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onPress={() => navigation.navigate("ChannelMsg", { channelId: channel.id, channelData: channel })}
              buttonTitle={t("channelsScreen.unfollow")}
              buttonColor="#ff9900"
              onButtonPress={() => handleUnfollow(channel)}
            />
          )) : <Text style={{ margin: 10, color: "#555" }}>{t("channelsScreen.notFollowing")}</Text>}

          {/* Discover Section */}
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#006644", marginVertical: 5 }}>{t("channelsScreen.discover")}</Text>
          {discover.length > 0 ? discover.map(channel => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onPress={() => {
                Alert.alert(
                  t("channelsScreen.alertFollowTitle"),
                  t("channelsScreen.alertFollowMsg"),
                  [
                    { text: t("channelsScreen.cancel"), style: "cancel" },
                    { text: t("channelsScreen.follow"), onPress: () => handleFollow(channel) },
                  ]
                );
              }}
              buttonTitle={t("channelsScreen.follow")}
              buttonColor="#006644"
              onButtonPress={() => handleFollow(channel)}
            />
          )) : <Text style={{ margin: 10, color: "#555" }}>{t("channelsScreen.noChannels")}</Text>}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Channel Card Component
const ChannelCard = ({ channel, onPress, buttonTitle, buttonColor, onButtonPress }) => (
  <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 8, elevation: 1 }}>
    <TouchableOpacity onPress={onPress} style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <Image source={channel.image ? { uri: channel.image } : require("../../../images/chdummyimg.png")} style={{ width: 50, height: 50, borderRadius: 25 }} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15, color: "#000" }}>{channel.name}</Text>
        <Text style={{ fontSize: 12, color: "#555" }}>{channel.description}</Text>
      </View>
      {channel.unreadCount > 0 && (
        <View style={{ marginLeft: 'auto', backgroundColor: '#006644', borderRadius: 12, paddingVertical: 2, paddingHorizontal: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{channel.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
    <TouchableOpacity style={{ backgroundColor: buttonColor, paddingVertical: 6, paddingHorizontal: 18, borderRadius: 8 }} onPress={onButtonPress}>
      <Text style={{ color: "#fff", fontWeight: "bold" }}>{buttonTitle}</Text>
    </TouchableOpacity>
  </View>
);

export default ChannelsScreen;
