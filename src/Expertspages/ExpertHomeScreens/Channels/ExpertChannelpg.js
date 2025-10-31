import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ExpertChannel = ({ navigation }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [ownChannels, setOwnChannels] = useState([]);
  const [followingChannels, setFollowingChannels] = useState([]);
  const [discoverChannels, setDiscoverChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const user = auth().currentUser;

        if (!user) {
          console.log('⚠️ No user logged in.');
          setLoading(false);
          return;
        }

        // --- Fetch Own Channels ---
        const ownSnap = await firestore()
          .collection('channels')
          .where('createdBy', '==', user.uid)
          .get();

        const ownCh = ownSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOwnChannels(ownCh);

        // --- Fetch Following Channels ---
        const followingSnap = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('followedChannels')
          .get();

        const followingIds = followingSnap.docs.map(doc => doc.data().channelId);
        let followingCh = [];

        if (followingIds.length > 0) {
          const promises = followingIds.map(id =>
            firestore().collection('channels').doc(id).get()
          );
          const results = await Promise.all(promises);
          followingCh = results
            .map(doc => (doc.exists ? { id: doc.id, ...doc.data() } : null))
            .filter(Boolean);
        }
        setFollowingChannels(followingCh);

        // --- Fetch Discover Channels ---
        const discoverSnap = await firestore()
          .collection('channels')
          .where('createdBy', '!=', user.uid)
          .get();

        const discoverCh = discoverSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(doc => !followingIds.includes(doc.id));
        setDiscoverChannels(discoverCh);
      } catch (error) {
        console.error('❌ Error fetching channels:', error);
        alert('Error loading channels: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const filterChannels = channels =>
    channels.filter(
      ch =>
        ch.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // ✅ Fixed: Now navigation passes channelId properly
  const renderChannelList = (title, channels, onPressNav, emptyMessage) => (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#006644', marginVertical: 5 }}>
        {title}
      </Text>

      {channels.length === 0 ? (
        <Text style={{ color: '#666', fontSize: 14, textAlign: 'center', marginVertical: 8 }}>
          {emptyMessage}
        </Text>
      ) : (
        filterChannels(channels).map(channel => (
          <TouchableOpacity
            key={channel.id}
            onPress={() =>
              navigation.navigate(onPressNav, {
                channelId: channel.id, // ✅ Fixed: Pass channel ID
                name: channel.name,
                image: channel.imageUrl
                  ? { uri: channel.imageUrl }
                  : require('../../../images/chdummyimg.png'),
                description: channel.description,
              })
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 10,
              marginBottom: 8,
              elevation: 1,
            }}
          >
            <Image
              source={
                channel.imageUrl
                  ? { uri: channel.imageUrl }
                  : require('../../../images/chdummyimg.png')
              }
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>
                {channel.name}
              </Text>
              <Text style={{ fontSize: 12, color: '#555' }}>{channel.description}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../images/background.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* --- Header --- */}
        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 15,
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#031501ff' }}>
            {t('expertChannels.channels')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateChannel')}
              style={{ marginRight: 10 }}
            >
              <Icon name="add" size={26} color="#031501ff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ExpertSettingsStack')}>
              <Icon name="settings" size={26} color="#031501ff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Search Bar --- */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 25,
            paddingHorizontal: 15,
            marginHorizontal: 10,
            elevation: 2,
            height: 45,
          }}
        >
          <Icon name="search" size={20} color="#888" />
          <TextInput
            placeholder={t('expertChannels.searchChannels')}
            placeholderTextColor="#888"
            style={{ flex: 1, marginLeft: 8, color: '#000' }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#006644" style={{ marginTop: 30 }} />
        ) : (
          <ScrollView style={{ flex: 1, paddingHorizontal: 10, marginTop: 10 }}>
            {renderChannelList(
              t('expertChannels.yourChannels'),
              ownChannels,
              'OwnChannelMsgScreen',
              'You haven’t created any channels yet.'
            )}
            {renderChannelList(
              t('expertChannels.following'),
              followingChannels,
              'ExpertChannelMsg',
              'You are not following any channels yet.'
            )}
            {renderChannelList(
              t('expertChannels.discover'),
              discoverChannels,
              'ExpertChannelMsg',
              'No channels to discover at the moment.'
            )}
          </ScrollView>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertChannel;
