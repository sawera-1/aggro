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
import { useFocusEffect } from '@react-navigation/native';
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

        let ownCh = ownSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), unreadCount: 0 }));
        if (ownCh.length > 0) {
          const ownComputed = await Promise.all(ownCh.map(async ch => {
            try {
              const snap = await firestore()
                .collection('channels').doc(ch.id).collection('messages')
                .orderBy('createdAt', 'desc').limit(50).get();
              const userId = user.uid;
              const unread = snap.docs.reduce((acc, d) => {
                const m = d.data() || {};
                const readBy = m.readBy || {};
                const isOwn = m.senderId === userId;
                const isRead = !!readBy[userId];
                return acc + (!isOwn && !isRead ? 1 : 0);
              }, 0);
              ch.unreadCount = unread;
            } catch { }
            return ch;
          }));
          ownCh = ownComputed;
        }
        setOwnChannels(ownCh);

        // --- Fetch Following Channels + followedAt ---
        const followingSnap = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('followedChannels')
          .get();

        const followingMeta = {};
        followingSnap.docs.forEach(d => {
          const data = d.data() || {};
          const id = data.channelId || d.id;
          const followedAt = data.followedAt?.toDate?.() || null;
          if (id) followingMeta[id] = { followedAt };
        });
        const followingIds = Object.keys(followingMeta);
        let followingCh = [];

        if (followingIds.length > 0) {
          const results = await Promise.all(
            followingIds.map(id => firestore().collection('channels').doc(id).get())
          );
          followingCh = results
            .map(doc => (doc.exists ? { id: doc.id, ...doc.data() } : null))
            .filter(Boolean)
            .map(ch => ({ ...ch, unreadCount: 0 }));

          // Compute unread counts (best-effort on recent 50 messages)
          const computePromises = followingCh.map(async ch => {
            try {
              const since = followingMeta[ch.id]?.followedAt;
              const snap = await firestore()
                .collection('channels')
                .doc(ch.id)
                .collection('messages')
                .orderBy('createdAt', 'desc')
                .limit(50)
                .get();
              const unread = snap.docs.reduce((acc, mdoc) => {
                const m = mdoc.data() || {};
                const createdAt = m.createdAt?.toDate?.() || null;
                const isAfterFollow = since ? (!createdAt || createdAt >= since) : true;
                const readBy = m.readBy || {};
                const isOwn = m.senderId === user.uid;
                const isRead = !!readBy[user.uid];
                return acc + (isAfterFollow && !isOwn && !isRead ? 1 : 0);
              }, 0);
              ch.unreadCount = unread;
            } catch { }
            return ch;
          });
          const withUnread = await Promise.all(computePromises);
          followingCh = withUnread;
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
        alert(t('expertChannels.errorLoading') + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // Refresh counts when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      const user = auth().currentUser;
      if (!user) return;
      // re-run the same fetch to update unread badges
      (async () => {
        try {
          setLoading(true);
          // Reload ownChannels unread
          const ownSnap = await firestore()
            .collection('channels').where('createdBy', '==', user.uid).get();
          let ownCh = ownSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), unreadCount: 0 }));
          if (ownCh.length) {
            ownCh = await Promise.all(ownCh.map(async ch => {
              try {
                const snap = await firestore().collection('channels').doc(ch.id)
                  .collection('messages').orderBy('createdAt', 'desc').limit(50).get();
                const userId = user.uid;
                const unread = snap.docs.reduce((acc, d) => {
                  const m = d.data() || {};
                  const readBy = m.readBy || {};
                  const isOwn = m.senderId === userId;
                  const isRead = !!readBy[userId];
                  return acc + (!isOwn && !isRead ? 1 : 0);
                }, 0);
                ch.unreadCount = unread;
              } catch { }
              return ch;
            }));
          }
          setOwnChannels(ownCh);

          // Reload followingChannels unread
          const followingSnap = await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('followedChannels')
            .get();
          const followingMeta = {};
          followingSnap.docs.forEach(d => {
            const data = d.data() || {};
            const id = data.channelId || d.id;
            const followedAt = data.followedAt?.toDate?.() || null;
            if (id) followingMeta[id] = { followedAt };
          });
          const followingIds = Object.keys(followingMeta);
          if (!followingIds.length) { setFollowingChannels([]); return; }
          const results = await Promise.all(
            followingIds.map(id => firestore().collection('channels').doc(id).get())
          );
          let followingCh = results
            .map(doc => (doc.exists ? { id: doc.id, ...doc.data(), unreadCount: 0 } : null))
            .filter(Boolean);
          const compute = await Promise.all(followingCh.map(async ch => {
            try {
              const since = followingMeta[ch.id]?.followedAt;
              const snap = await firestore()
                .collection('channels').doc(ch.id).collection('messages')
                .orderBy('createdAt', 'desc').limit(50).get();
              const unread = snap.docs.reduce((acc, d) => {
                const m = d.data() || {};
                const createdAt = m.createdAt?.toDate?.() || null;
                const isAfterFollow = since ? (!createdAt || createdAt >= since) : true;
                const readBy = m.readBy || {};
                const isOwn = m.senderId === user.uid;
                const isRead = !!readBy[user.uid];
                return acc + (isAfterFollow && !isOwn && !isRead ? 1 : 0);
              }, 0);
              ch.unreadCount = unread;
            } catch { }
            return ch;
          }));
          setFollowingChannels(compute);
        } finally {
          setLoading(false);
        }
      })();
    }, [])
  );

  const filterChannels = channels =>
    channels.filter(
      ch =>
        ch.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  //  Fixed: Now navigation passes channelId properly
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
                channelId: channel.id,
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
            {!!channel.unreadCount && channel.unreadCount > 0 && (
              <View style={{ backgroundColor: '#006644', borderRadius: 12, paddingVertical: 2, paddingHorizontal: 8 }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{channel.unreadCount}</Text>
              </View>
            )}
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
            {/* Your Channels */}
            {renderChannelList(
              t('expertChannels.yourChannels'),
              ownChannels,
              'OwnChannelMsgScreen',
              t('expertChannels.noOwnChannels')
            )}

            {/* Following Channels */}
            {renderChannelList(
              t('expertChannels.following'),
              followingChannels,
              'ExpertChannelMsg',
              t('expertChannels.noFollowing')
            )}

            {/* Discover Channels */}
            {renderChannelList(
              t('expertChannels.discover'),
              discoverChannels,
              'ExpertChannelMsg',
              t('expertChannels.noDiscover')
            )}

          </ScrollView>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ExpertChannel;
