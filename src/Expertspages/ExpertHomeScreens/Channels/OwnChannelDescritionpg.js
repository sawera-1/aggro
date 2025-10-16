import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';

const CLOUDINARY_UPLOAD_PRESET = 'react_native_uploads'; // <- replace with your actual preset
const CLOUDINARY_CLOUD_NAME = 'dumgs9cp4'; // <- replace with your actual cloud name

const OwnChannelDescription = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { channelId } = route.params;

  const [channelData, setChannelData] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [membersCount, setMembersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch channel info
  useEffect(() => {
    if (!channelId) {
      Alert.alert('Error', 'Channel ID missing!');
      return;
    }

    const unsubscribeChannel = firestore()
      .collection('channels')
      .doc(channelId)
      .onSnapshot(
        async (doc) => {
          if (doc.exists) {
            const data = doc.data();
            setChannelData(data);

            // Fetch creator info from users
            if (data.createdBy) {
              const userDoc = await firestore().collection('users').doc(data.createdBy).get();
              if (userDoc.exists) setCreatorData(userDoc.data());
              else setCreatorData(null);
            }
          } else {
            Alert.alert('Error', 'Channel not found!');
          }
          setLoading(false);
        },
        (error) => {
          console.error('🔥 Channel fetch error:', error);
          Alert.alert('Error', 'Could not fetch channel info.');
          setLoading(false);
        }
      );

    const unsubscribeMembers = firestore()
      .collection('channels')
      .doc(channelId)
      .collection('members')
      .onSnapshot(
        (snapshot) => setMembersCount(snapshot.size),
        (error) => console.error('🔥 Members fetch error:', error)
      );

    return () => {
      unsubscribeChannel();
      unsubscribeMembers();
    };
  }, [channelId]);

  // Update channel info (editable for owner)
  const handleSaveChanges = async () => {
    if (!channelData) return;
    try {
      await firestore().collection('channels').doc(channelId).update({
        name: channelData.name || '',
        description: channelData.description || '',
      });
      Alert.alert('✅ Success', 'Channel info updated!');
    } catch (err) {
      console.error('🔥 Update error:', err);
      Alert.alert('❌ Error', 'Failed to update channel info.');
    }
  };

  // Pick and upload new channel image
  const handleEditImage = async () => {
    try {
      setUploading(true);
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
      if (result.didCancel || !result.assets?.[0]?.uri) {
        setUploading(false);
        return;
      }
      const asset = result.assets[0];

      // Upload to Cloudinary or your image server
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `channel_${channelId}.jpg`,
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!json.secure_url) throw new Error('Upload failed');

      // Update channel image in Firestore
      await firestore().collection('channels').doc(channelId).update({
        imageUrl: json.secure_url,
      });
      Alert.alert('✅ Success', 'Channel image updated!');
    } catch (error) {
      console.error('🔥 Image upload error:', error);
      Alert.alert('Error', 'Failed to update image.');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !channelData) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ECE5DD' }}>
        <ActivityIndicator size="large" color="#006644" />
        <Text style={{ marginTop: 18, color: '#006644', fontWeight: 'bold' }}>Loading Channel...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../images/background.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.9 }}
      >
        {/* Top Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#006644', elevation: 5 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Image
            source={channelData.imageUrl ? { uri: channelData.imageUrl } : require('../../../images/chdummyimg.png')}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', flexShrink: 1 }}>
            {channelData.name || 'Unnamed Channel'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Channel Image */}
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Image
              source={channelData.imageUrl ? { uri: channelData.imageUrl } : require('../../../images/chdummyimg.png')}
              style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#006644' }}
            />
            <TouchableOpacity onPress={handleEditImage} disabled={uploading}>
              <Text style={{ color: uploading ? '#aaa' : '#006644', fontSize: 18, marginTop: 8 }}>
                {uploading ? t('ownchannelDes.uploading') || 'Uploading...' : t('ownchannelDes.edit')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Channel Info Form */}
          <View style={{ padding: 20, backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 15, elevation: 2 }}>
            <TextInput
              value={channelData.name}
              onChangeText={text => setChannelData({ ...channelData, name: text })}
              placeholder={t('ownchannelDes.channelName')}
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16 }}
            />
            <TextInput
              value={channelData.description}
              onChangeText={text => setChannelData({ ...channelData, description: text })}
              placeholder={t('ownchannelDes.channelDescription')}
              multiline
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, height: 100, textAlignVertical: 'top', fontSize: 16, marginBottom: 15 }}
            />

            {/* Members Section */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {t('ownchannelDes.totalMembers')}: {membersCount}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('contactpg')}
                style={{ backgroundColor: '#00aaff', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {t('ownchannelDes.addMember')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Created By Section */}
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 14 }}>
              {t('ownchannelDes.createdBy')}: {creatorData?.name || channelData.createdBy || 'N/A'}
            </Text>
            

            <TouchableOpacity
              style={{ backgroundColor: '#006644', padding: 14, borderRadius: 12, alignItems: 'center', elevation: 2 }}
              onPress={handleSaveChanges}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                {t('ownchannelDes.saveChanges')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OwnChannelDescription;