import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

export default function ExpertSetting({ navigation }) {
  const { t } = useTranslation();
  const [logoutVisible, setLogoutVisible] = useState(false);

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
            {t('exsettings.title')}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          {/* Profile */}
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Image
              source={require('../images/a.png')}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginTop: 10,
                color: '#006644'
              }}
            >
              {t('exsettings.name')}
            </Text>
            <Text style={{ color: '#006644', marginTop: 4 }}>
              +123 456 7890
            </Text>
          </View>

          {/* Menu Item: My Account */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 15,
              marginHorizontal: 15,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#006644',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.85)'
            }}
            onPress={() => navigation.navigate('ExpertMyAcc')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="person" size={22} color="#006644" style={{ marginRight: 15 }} />
              <Text style={{ fontSize: 16, color: '#000' }}>
                {t('exsettings.myAccount')}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          {/* Menu Item: Privacy Policy */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 15,
              marginHorizontal: 15,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#006644',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.85)'
            }}
            onPress={() => navigation.navigate('FPrivacyPolicy')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="privacy-tip" size={22} color="#006644" style={{ marginRight: 15 }} />
              <Text style={{ fontSize: 16, color: '#000' }}>
                {t('exsettings.privacyPolicy')}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          {/* Menu Item: Language */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 15,
              marginHorizontal: 15,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#006644',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.85)'
            }}
            onPress={() => navigation.navigate('FLanguage')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="language" size={22} color="#006644" style={{ marginRight: 15 }} />
              <Text style={{ fontSize: 16, color: '#000' }}>
                {t('exsettings.language')}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          {/* Menu Item: Feedback */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 15,
              marginHorizontal: 15,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#006644',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.85)'
            }}
            onPress={() => navigation.navigate('FarmerFeedback')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="feedback" size={22} color="#006644" style={{ marginRight: 15 }} />
              <Text style={{ fontSize: 16, color: '#000' }}>
                {t('exsettings.feedback')}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 15,
              marginHorizontal: 15,
              marginBottom: 30,
              borderWidth: 1,
              borderColor: '#006644',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.85)'
            }}
            onPress={() => setLogoutVisible(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="logout" size={22} color="red" style={{ marginRight: 15 }} />
              <Text style={{ fontSize: 16, color: 'red' }}>{t('exsettings.logout')}</Text>
            </View>
          </TouchableOpacity>

          {/* Logout Modal */}
          <Modal transparent visible={logoutVisible} animationType="fade">
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  backgroundColor: '#e9e9e1',
                  width: '85%',
                  padding: 20,
                  borderRadius: 15,
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    marginBottom: 12,
                    color: '#333',
                    textAlign: 'center'
                  }}
                >
                  {t('exsettings.logoutModalTitle')}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#555',
                    marginBottom: 20,
                    textAlign: 'center'
                  }}
                >
                  {t('exsettings.logoutModalMessage')}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 18,
                      borderRadius: 10,
                      flex: 1,
                      justifyContent: 'center',
                      backgroundColor: '#006644',
                      marginRight: 8
                    }}
                    onPress={() => setLogoutVisible(false)}
                  >
                    <Ionicons name="close" size={20} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                      {t('exsettings.cancel')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 18,
                      borderRadius: 10,
                      flex: 1,
                      justifyContent: 'center',
                      backgroundColor: '#cc0000',
                      marginLeft: 8
                    }}
                    onPress={() => {
                      setLogoutVisible(false);
                      // TODO: add your logout logic
                    }}
                  >
                    <Ionicons name="log-out" size={20} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                      {t('exsettings.logout')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
