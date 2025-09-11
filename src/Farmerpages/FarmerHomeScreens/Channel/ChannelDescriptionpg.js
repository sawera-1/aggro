import React, { useState } from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, Modal, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native-safe-area-context";
export default function ChannelDescription({ navigation }) {
  const route = useRoute();
  const { t } = useTranslation(); 
  const { channelName, channelImage, channelDescription, members, dateCreated } = route.params || {};
  const [exitModalVisible, setExitModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../images/background.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.9 }}
      >
        {/* Top Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: '#006644',
          elevation: 5
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Image
            source={
              channelImage
                ? (typeof channelImage === 'string' ? { uri: channelImage } : channelImage)
                : require('../../../images/chdummyimg.png')
            }
            style={{ width: 38, height: 38, borderRadius: 19, marginRight: 12, borderWidth: 1, borderColor: '#fff' }}
          />
          <Text style={{ color: '#fff', fontSize: 19, fontWeight: 'bold', flexShrink: 1 }}>
            {channelName}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
          {/* DP */}
          <Image
            source={
              channelImage
                ? (typeof channelImage === 'string' ? { uri: channelImage } : channelImage)
                : require('../../../images/chdummyimg.png')
            }
            style={{
              width: 130,
              height: 130,
              borderRadius: 65,
              borderWidth: 2.5,
              borderColor: '#006644',
              marginBottom: 15
            }}
          />

          {/* Group Info */}
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#006644', marginBottom: 6 }}>
            {channelName}
          </Text>
          <Text style={{ fontSize: 15, color: '#444', marginBottom: 6 }}>
            {t('channelDescription.totalMembers')}: {members || '10'}
          </Text>
          <Text style={{ fontSize: 15, color: '#444', marginBottom: 18 }}>
            {t('channelDescription.dateCreated')}: {dateCreated || '01 Jan 2025'}
          </Text>

          {/* Description */}
          <Text style={{ fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 35, paddingHorizontal: 15 }}>
            {channelDescription || t('channelDescription.noDescription')}
          </Text>

          {/* Exit Group Button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ff9900',
              paddingVertical: 15,
              paddingHorizontal: 22,
              borderRadius: 14,
              marginBottom: 18,
              width: '90%',
              elevation: 4
            }}
            onPress={() => setExitModalVisible(true)}
          >
            <Ionicons name="exit-outline" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {t('channelDescription.exitGroup')}
            </Text>
          </TouchableOpacity>

          {/* Report Group Button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#cc0000',
              paddingVertical: 15,
              paddingHorizontal: 22,
              borderRadius: 14,
              marginBottom: 18,
              width: '90%',
              elevation: 4
            }}
            onPress={() => navigation.navigate('FarmerFeedback')}
          >
            <Ionicons name="alert-circle" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {t('channelDescription.reportGroup')}
            </Text>
          </TouchableOpacity>

          {/* Chat with Expert Button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#006644',
              paddingVertical: 15,
              paddingHorizontal: 22,
              borderRadius: 14,
              width: '90%',
              elevation: 4
            }}
            onPress={() => navigation.navigate('ChatWithExpert', { channelName })}
          >
            <Ionicons name="chatbubble-ellipses" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {t('channelDescription.chatWithExpert')}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Exit Group Modal */}
        <Modal transparent animationType="fade" visible={exitModalVisible} onRequestClose={() => setExitModalVisible(false)}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: '#e9e9e1',
              padding: 20,
              borderRadius: 14,
              width: '85%',
              elevation: 4,
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 15, color: '#333', textAlign: 'center' }}>
                {t('channelDescription.exitConfirmation')}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#006644',
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    borderRadius: 10,
                    flex: 1,
                    marginRight: 8,
                  }}
                  onPress={() => setExitModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                    {t('channelDescription.cancel')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#ff9900',
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    borderRadius: 10,
                    flex: 1,
                    marginLeft: 8,
                  }}
                  onPress={() => setExitModalVisible(false)}
                >
                  <Ionicons name="exit-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                    {t('channelDescription.exit')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}
