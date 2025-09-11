import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserData } from '../Helper/firebaseHelper';


export default function FarmerMyAcc() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dpImage, setDpImage] = useState(null);

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        if (data) {
          setName(data.name || "");
          setPhone(data.phoneNumber || "");
          setDpImage(data.dpImage || null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ Pick image (only preview for now)
  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
        return;
      }
      const asset = response.assets?.[0];
      if (asset?.uri) {
        setDpImage(asset.uri);
      }
    });
  };

  // ✅ Save changes
  const handleSave = async () => {
    try {
      await updateUserData({ name, phoneNumber: phone });
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#006644" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../images/background.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ resizeMode: 'cover', opacity: 0.9 }}
      >
        {/* Top Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 12,
            backgroundColor: '#006644',
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={dpImage ? { uri: dpImage } : require('../images/a.png')}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                {name || "No Name"}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}>
          {/* Profile Image with Picker */}
          <View style={{ alignSelf: 'center', marginBottom: 20, position: 'relative' }}>
            <Image
              source={dpImage ? { uri: dpImage } : require('../images/a.png')}
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                borderWidth: 3,
                borderColor: '#006644',
              }}
            />
            <TouchableOpacity
              onPress={pickImage}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#006644',
                borderRadius: 15,
                padding: 5,
              }}
            >
              <Icon name="photo-camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#006644', marginBottom: 5 }}>
            {t('farmerMyaccount.nameLabel')}
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('farmerMyaccount.namePlaceholder')}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 20,
            }}
          />

          {/* Phone Input */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#006644', marginBottom: 5 }}>
            {t('farmerMyaccount.phoneLabel')}
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder={t('farmerMyaccount.phonePlaceholder')}
            keyboardType="phone-pad"
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: '#ccc',
            }}
          />

          {/* Save Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#006644',
              paddingVertical: 12,
              borderRadius: 10,
              marginTop: 30,
              alignItems: 'center',
            }}
            onPress={handleSave}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              {t('farmerMyaccount.saveBtn')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
