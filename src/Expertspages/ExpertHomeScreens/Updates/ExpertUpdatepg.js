import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { getGovtSchemes, getCropInfo } from "../../../Helper/firebaseHelper"; 

//  Reusable Card
const SchemeCard = ({ item, onPress, iconSource }) => (
  <View
    style={{
      flexDirection: "row",
      borderWidth: 1,
      borderColor: "#006644",
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      backgroundColor: "#e9e9e1",
    }}
  >
    <Image
      source={iconSource}
      style={{ width: 80, height: 80, borderRadius: 8, marginRight: 20 }}
    />
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <Text style={{ color: "#006644", fontWeight: "bold", fontSize: 16 }}>
        {item.name || item.title || "Untitled"}
      </Text>

      
      <Text style={{ color: "#888", fontSize: 12, marginVertical: 5 }}>
        {item.source || "Official Update"}
      </Text>

      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          backgroundColor: "#006644",
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#fff", marginRight: 5 }}>Read More</Text>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "#e9e9e1",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="arrow-forward" size={14} color="#006644" />
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const ExpertUpdate = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("GovtSchemes");
  const { t } = useTranslation();

  const [govtSchemes, setGovtSchemes] = useState([]);
  const [cropInfo, setCropInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (selectedTab === "GovtSchemes") {
          const data = await getGovtSchemes();
          setGovtSchemes(data);
        } else if (selectedTab === "CropInfo") {
          const data = await getCropInfo();
          setCropInfo(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab]);

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
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingTop: 15,
            paddingBottom: 10,
          }}
        >
          <Text
            style={{ fontSize: 22, fontWeight: "bold", color: "#031501ff" }}
          >
            {t("updates.title")}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ExpertSettingsStack")}
          >
            <Icon name="settings" size={26} color="#031501ff" />
          </TouchableOpacity>
        </View>

        

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedTab("GovtSchemes")}
            style={{
              paddingBottom: 5,
              borderBottomWidth: selectedTab === "GovtSchemes" ? 2 : 0,
              borderBottomColor: "#006644",
            }}
          >
            <Text
              style={{
                color:
                  selectedTab === "GovtSchemes" ? "#006644" : "#031501ff",
                fontWeight:
                  selectedTab === "GovtSchemes" ? "bold" : "normal",
              }}
            >
              {t("updates.tabs.govt")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab("CropInfo")}
            style={{
              paddingBottom: 5,
              borderBottomWidth: selectedTab === "CropInfo" ? 2 : 0,
              borderBottomColor: "#006644",
            }}
          >
            <Text
              style={{
                color:
                  selectedTab === "CropInfo" ? "#006644" : "#031501ff",
                fontWeight:
                  selectedTab === "CropInfo" ? "bold" : "normal",
              }}
            >
              {t("updates.tabs.crop")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#006644" />
          ) : selectedTab === "GovtSchemes" ? (
            govtSchemes.map((item) => (
              <SchemeCard
                key={item.id}
                item={item}
                iconSource={require("../../../images/govt.png")}
                onPress={() =>
                  navigation.navigate("ExpertGovtReadMore", { scheme: item })
                }
              />
            ))
          ) : (
            cropInfo.map((item) => (
              <SchemeCard
                key={item.id}
                item={item}
                iconSource={require("../../../images/c.png")}
                onPress={() =>
                  navigation.navigate("ExpertCropReadMore", { crop: item })
                }
              />
            ))
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertUpdate;
