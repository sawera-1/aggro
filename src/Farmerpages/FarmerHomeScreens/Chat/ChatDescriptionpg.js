import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

export default function ChatDescription() {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { chatName, chatPhone, chatImage } = route.params || {};
  const [blockModalVisible, setBlockModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Background Image */}
      <Image
        source={require('../../../images/background.jpg')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          opacity: 0.9,
        }}
      />

      {/* Top Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: '#006644',
          elevation: 5,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Image
          source={
            chatImage
              ? (typeof chatImage === 'string' ? { uri: chatImage } : chatImage)
              : require('../../../images/chdummyimg.png')
          }
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            marginRight: 12,
            borderWidth: 1,
            borderColor: '#fff',
          }}
        />

        <Text
          style={{
            color: '#fff',
            fontSize: 19,
            fontWeight: 'bold',
            flexShrink: 1,
          }}
        >
          {chatName}
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          alignItems: 'center',
          flexGrow: 1,
        }}
      >
        {/* Large Circular DP */}
        <Image
          source={
            chatImage
              ? (typeof chatImage === 'string' ? { uri: chatImage } : chatImage)
              : require('../../../images/chdummyimg.png')
          }
          style={{
            width: 130,
            height: 130,
            borderRadius: 65,
            borderWidth: 2.5,
            borderColor: '#006644',
            marginBottom: 15,
          }}
        />

        {/* Name */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#006644',
            marginBottom: 6,
          }}
        >
          {chatName}
        </Text>

        {/* Phone */}
        <Text style={{ fontSize: 15, color: '#444', marginBottom: 18 }}>
          {t('chatDescription.phone')}: {chatPhone || 'N/A'}
        </Text>

        {/* Block Button */}
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
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 5,
            elevation: 4,
          }}
          onPress={() => setBlockModalVisible(true)}
        >
          <Ionicons name="close-circle" size={22} color="#fff" style={{ marginRight: 10 }} />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {t('chatDescription.blockUser')}
          </Text>
        </TouchableOpacity>

        {/* Report Button */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ff9900',
            paddingVertical: 15,
            paddingHorizontal: 22,
            borderRadius: 14,
            width: '90%',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 5,
            elevation: 4,
          }}
          onPress={() => navigation.navigate('FarmerFeedback')}
        >
          <Ionicons name="alert-circle" size={22} color="#fff" style={{ marginRight: 10 }} />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {t('chatDescription.reportUser')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Block Confirmation Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={blockModalVisible}
        onRequestClose={() => setBlockModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#e9e9e1',
              padding: 20,
              borderRadius: 14,
              width: '85%',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 3 },
              shadowRadius: 5,
              elevation: 4,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 15,
                color: '#333',
                textAlign: 'center',
              }}
            >
              {t('chatDescription.blockConfirmation')}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
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
                onPress={() => setBlockModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#fff" style={{ marginRight: 6 }} />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                  {t('chatDescription.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#cc0000',
                  paddingVertical: 12,
                  paddingHorizontal: 18,
                  borderRadius: 10,
                  flex: 1,
                  marginLeft: 8,
                }}
                onPress={() => {
                  setBlockModalVisible(false);
                  
                }}
              >
                <Ionicons name="close-circle" size={20} color="#fff" style={{ marginRight: 6 }} />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                  {t('chatDescription.block')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
