import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function SettingsScreen({ navigation }) {
  const { t } = useTranslation();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth().currentUser.uid;

    // Real-time listener for user data
    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(
        doc => {
          if (doc.exists) {
            setUser(doc.data());
          }
          setLoading(false);
        },
        error => {
          console.error(t("settings.realtimeFetchFailed"), error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
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
      <ImageBackground
        source={require('../images/background.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.9 }}
      >
        {/* Top Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 12,
            backgroundColor: '#006644'
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
            {t('settings.title')}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          {/* Profile Section */}
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Image
              source={user?.dpImage ? { uri: user.dpImage } : require('../images/a.png')}
              style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#006644' }}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, color: '#006644' }}>
              {user?.name || t("settings.noName")}
            </Text>
            <Text style={{ color: '#006644', marginTop: 4 }}>
              {user?.phoneNumber || t("settings.noPhone")}
            </Text>
          </View>

          {/* Menu Items */}
          <MenuItem
            icon="person"
            label={t('settings.myAccount')}
            onPress={() => navigation.navigate('FMyAccount')}
          />
          <MenuItem
            icon="privacy-tip"
            label={t('settings.privacyPolicy')}
            onPress={() => navigation.navigate('FPrivacyPolicy')}
          />
          <MenuItem
            icon="language"
            label={t('settings.language')}
            onPress={() => navigation.navigate('FLanguage')}
          />
          <MenuItem
            icon="logout"
            label={t('settings.logout')}
            color="red"
            onPress={() => setLogoutVisible(true)}
          />

          {/* Logout Modal */}
          <LogoutModal
            visible={logoutVisible}
            t={t}
            onCancel={() => setLogoutVisible(false)}
            onConfirm={async () => {
              try {
                await auth().signOut();
                setLogoutVisible(false);
                navigation.replace('FarmerLogin');
              } catch (error) {
                console.error(t("settings.logoutFailed"), error);
              }
            }}
          />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// Menu Item Component
const MenuItem = ({ icon, label, onPress, color = '#000' }) => (
  <TouchableOpacity style={menuStyle} onPress={onPress}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name={icon} size={22} color={color === '#000' ? '#006644' : color} style={{ marginRight: 15 }} />
      <Text style={{ fontSize: 16, color }}>{label}</Text>
    </View>
    <Icon name="chevron-right" size={24} color="#999" />
  </TouchableOpacity>
);

// Logout Modal Component
const LogoutModal = ({ visible, onCancel, onConfirm, t }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: '#e9e9e1', width: '85%', padding: 20, borderRadius: 15, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333', textAlign: 'center' }}>
          {t('settings.logoutConfirm')}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, flex: 1, justifyContent: 'center', backgroundColor: '#006644', marginRight: 8 }}
            onPress={onCancel}
          >
            <Ionicons name="close" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>{t('settings.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, flex: 1, justifyContent: 'center', backgroundColor: '#cc0000', marginLeft: 8 }}
            onPress={onConfirm}
          >
            <Ionicons name="log-out" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>{t('settings.logout')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const menuStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 15,
  marginHorizontal: 15,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#006644',
  borderRadius: 10,
  backgroundColor: 'rgba(255,255,255,0.85)',
};
