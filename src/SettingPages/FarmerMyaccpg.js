import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function FarmerMyAcc() {
  const navigation = useNavigation();
  const { t } = useTranslation();

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
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          {/* Profile Info */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../images/a.png')}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                {t('farmerMyaccount.farmerName')}
              </Text>
              <Text style={{ fontSize: 14, color: '#e0e0e0' }}>
                {t('farmerMyaccount.farmerPhone')}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}>
          {/* Profile Image for Editing */}
          <View style={{ alignSelf: 'center', marginBottom: 20, position: 'relative' }}>
            <Image
              source={require('../images/a.png')}
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                borderWidth: 3,
                borderColor: '#006644',
              }}
            />
            <View
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
            </View>
          </View>

          {/* Name Input */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#006644', marginBottom: 5 }}>
            {t('farmerMyaccount.nameLabel')}
          </Text>
          <TextInput
            placeholder={t('farmerMyaccount.namePlaceholder')}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: '#ccc',
            }}
          />

          {/* Phone Number Input */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#006644',
              marginBottom: 5,
              marginTop: 15,
            }}
          >
            {t('farmerMyaccount.phoneLabel')}
          </Text>
          <TextInput
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
