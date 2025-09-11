import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  Modal,
  ImageBackground,
  ActivityIndicator,
  FlatList
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { getQueries } from "../../../Helper/firebaseHelper";
import { SafeAreaView } from "react-native-safe-area-context";
const ChannelMsgScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const route = useRoute();
  const { name, image, description } = route.params || {};

  // Fetch queries from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const data = await getQueries();
      setQueries(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Loading indicator
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

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
            backgroundColor: "#006644",
            paddingVertical: 10,
            paddingHorizontal: 10
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChannelDes", {
                channelName: name,
                channelImage: image,
                channelDescription: description
              })
            }
          >
            <Image
              source={image || require("../../../images/chdummyimg.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginHorizontal: 10
              }}
            />
          </TouchableOpacity>

          <Text style={{ color: "#fff", fontSize: 18, flex: 1 }}>
            {name || "Unknown"}
          </Text>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 5,
              alignItems: "center"
            }}
          >
            <Entypo name="plus" size={18} color="#006644" />
            <Text style={{ color: "#006644", marginLeft: 5, fontSize: 16 }}>
              {t("channelmsg.follow")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat Body */}
        <FlatList
  style={{ flex: 1, padding: 10 }}
  data={queries}
  keyExtractor={(item, index) => item.id || index.toString()}
  renderItem={({ item }) => (
    <View
      style={{
        backgroundColor: "#DCF8C6",
        padding: 10,
        borderRadius: 10,
        alignSelf: "flex-start",
        marginBottom: 10
      }}
    >
      {/* Sender/User ID */}
      <Text style={{ fontWeight: "bold", fontSize: 14, color: "gray", marginBottom: 4 }}>
        {item.senderID?.trim() || "Unknown"}
      </Text>

      {/* Message */}
      <Text style={{ fontSize: 16, marginBottom: 4 }}>
        {item.message || item.queryType || "No message"}
      </Text>

      {/* Time */}
      <Text style={{ fontSize: 12, color: "blue", alignSelf: "flex-end" }}>
        {item.createdAt?.toDate
          ? item.createdAt.toDate().toLocaleString()
          : "No Date"}
      </Text>
    </View>
  )}
/>


        {/* Bottom Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 5,
            backgroundColor: "#006644",
            borderTopWidth: 1,
            borderColor: "#006644"
          }}
        >
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Entypo
              name="plus"
              size={24}
              color="#031501ff"
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>

          <TextInput
            placeholder={t("channelmsg.typeMessage")}
            style={{
              flex: 1,
              backgroundColor: "#e9e9e1",
              borderRadius: 20,
              paddingHorizontal: 15,
              marginHorizontal: 5
            }}
          />

          <TouchableOpacity>
            <Ionicons
              name="camera"
              size={24}
              color="#031501ff"
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome
              name="microphone"
              size={24}
              color="#031501ff"
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
        </View>

        {/* Popup Menu */}
        <Modal
          transparent
          animationType="fade"
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPressOut={() => setMenuVisible(false)}
          >
            <View
              style={{
                position: "absolute",
                bottom: 60,
                left: 10,
                backgroundColor: "#e9e9e9",
                borderRadius: 10,
                padding: 10,
                elevation: 5
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", paddingVertical: 8 }}
              >
                <Ionicons name="camera" size={20} color="#031501ff" />
                <Text style={{ marginLeft: 10 }}>{t("channelmsg.camera")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row", paddingVertical: 8 }}
              >
                <MaterialIcons
                  name="insert-drive-file"
                  size={20}
                  color="#031501ff"
                />
                <Text style={{ marginLeft: 10 }}>{t("channelmsg.documents")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row", paddingVertical: 8 }}
              >
                <Ionicons name="location" size={20} color="#031501ff" />
                <Text style={{ marginLeft: 10 }}>{t("channelmsg.location")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row", paddingVertical: 8 }}
              >
                <Ionicons name="images" size={20} color="#031501ff" />
                <Text style={{ marginLeft: 10 }}>{t("channelmsg.photos")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row", paddingVertical: 8 }}
              >
                <Ionicons name="person" size={20} color="#031501ff" />
                <Text style={{ marginLeft: 10 }}>{t("channelmsg.contact")}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ChannelMsgScreen;
