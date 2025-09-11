import React from 'react';
import {
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setRole } from '../redux/Slices/HomeDataSlice';
import { SafeAreaView } from "react-native-safe-area-context";

const UserType = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleRoleSelect = (role) => {
    dispatch(setRole(role)); // save role in Redux

    if (role === "farmer") {
      navigation.navigate("FarmerSignup");
    } else if (role === "expert") {
      navigation.navigate("ExpertSignup");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../images/background.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            zIndex: 1,
            backgroundColor: '#006644',
            padding: 10,
            borderRadius: 50,
          }}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Image
            source={require('../images/logodark.png')}
            style={{ width: 300, height: 100, marginBottom: 20 }}
          />

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#006644', marginBottom: 30 }}>
            {t("userType.title")}
          </Text>

          <Image
            source={require('../images/farmer.png')}
            style={{ width: 180, height: 180, resizeMode: 'contain', marginBottom: 30 }}
          />

          {/* Farmer Button */}
          <TouchableOpacity
            onPress={() => handleRoleSelect("farmer")}
            style={{
              backgroundColor: '#006644',
              height: 48,
              width: 200,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
              {t("userType.farmer")}
            </Text>
          </TouchableOpacity>

          {/* Expert Button */}
          <TouchableOpacity
            onPress={() => handleRoleSelect("expert")}
            style={{
              backgroundColor: '#006644',
              height: 48,
              width: 200,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
              {t("userType.expert")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default UserType;
