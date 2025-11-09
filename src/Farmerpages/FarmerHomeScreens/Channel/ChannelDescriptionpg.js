import React from 'react'; 
import { View, Text, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useTranslation } from 'react-i18next';

export default function ChannelDescription({ navigation }) {
  const { t } = useTranslation();
  const route = useRoute();
  const { channelName, channelImage, channelDescription, dateCreated, createdBy, channelId } = route.params || {};

  const goToChatWithExpert = async () => {
    try {
      const userDoc = await firestore().collection('users').doc(createdBy).get();
      if (!userDoc.exists) return alert(t('channelDescription.expertNotFound'));

      const expertData = userDoc.data();
      const me = auth().currentUser?.uid;
      if (me && createdBy) {
        const chatId = me < createdBy ? `${me}_${createdBy}` : `${createdBy}_${me}`;
        const chatRef = firestore().collection('chats').doc(chatId);
        const chatDoc = await chatRef.get();
        if (!chatDoc.exists) {
          await chatRef.set({
            participants: [me, createdBy],
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      navigation.navigate('ChatTab', {
        screen: 'ChatMsg',
        params: {
          current_user: auth().currentUser.uid,
          second_user: createdBy,
          secondUserName: expertData.name,
          secondUserPic: expertData.profileImage || expertData.dpImage || null,
          channelId,
          channelName,
        },
      });
    } catch (error) {
      console.log('Error fetching expert data:', error);
      alert(t('channelDescription.failedLoadExpert'));
    }
  };

  const handleReportChannel = () => {
    const reporterUserId = auth().currentUser?.uid;
    if (!reporterUserId) {
      return alert(t('channelDescription.loginToReport'));
    }

    // Pass all relevant channel info + reporter ID
    navigation.navigate('FarmerFeedback', {
      channelId,
      channelName,
      channelImage,
      channelDescription,
      dateCreated,
      createdBy, // creator of the channel
      reporterUserId, // current user reporting
    });
  };

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
          {/* Channel DP */}
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

          {/* Channel Info */}
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#006644', marginBottom: 10 }}>
            {channelName}
          </Text>
          <Text style={{ fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 10 }}>
            {channelDescription || t('channelDescription.noDescription')}
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 25 }}>
            {t('channelDescription.createdAt')}: {dateCreated || '01 Jan 2025'}
          </Text>

          {/* Report Channel Button */}
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
              justifyContent: 'center'
            }}
            onPress={handleReportChannel}
          >
            <Ionicons name="alert-circle" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {t('channelDescription.report')}
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
              justifyContent: 'center'
            }}
            onPress={goToChatWithExpert}
          >
            <Ionicons name="chatbubble-ellipses" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {t('channelDescription.chatWithExpert')}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
