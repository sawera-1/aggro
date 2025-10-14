import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ExpertChat({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Get logged-in user
  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setCurrentUser({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      });
    } else {
      Alert.alert('Authentication Error', 'Please log in to access chat features.');
    }
  }, []);

  // Get role + fetch users
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribeUser = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(
        (doc) => {
          if (!doc.exists) {
            console.warn("User document does not exist");
            return;
          }

          const userData = doc.data();
          const role = userData.role || "expert";
          setCurrentUser((prev) => ({ ...prev, role }));
          setUserProfile(userData);

          let query = firestore().collection('users');

          if (role === "expert") {
            // Experts can chat with both farmers and experts
            query = query.where("role", "in", ["farmer", "expert"]);
          } else {
            // Non-expert → empty
            setUsers([]);
            return;
          }

          const unsubscribeUsers = query.onSnapshot(
            (querySnap) => {
              const allUsers = querySnap.docs
                .map((d) => d.data())
                .filter((u) => u.uid !== currentUser.uid);
              setUsers(allUsers);
            },
            (error) => {
              console.error("Firestore error:", error);
              if (error.code === 'firestore/permission-denied') {
                Alert.alert('Permission Error', 'You do not have permission to access user data.');
              } else {
                Alert.alert('Error', 'Failed to load users. Please try again.');
              }
              setUsers([]);
            }
          );

          return () => unsubscribeUsers();
        },
        (error) => {
          console.error("Error fetching user data:", error);
          if (error.code === 'firestore/permission-denied') {
            Alert.alert('Permission Error', 'You do not have permission to access your user data.');
          } else {
            Alert.alert('Error', 'Failed to load user information. Please try again.');
          }
        }
      );

    return () => unsubscribeUser();
  }, [currentUser?.uid]);

  // Fetch unread message counts for each user
  useEffect(() => {
    if (!currentUser?.uid || users.length === 0) return;

    const fetchUnreadCounts = async () => {
      const counts = {};
      for (const user of users) {
        try {
          const chatId =
            currentUser.uid < user.uid
              ? `${currentUser.uid}_${user.uid}`
              : `${user.uid}_${currentUser.uid}`;

          const messagesRef = firestore()
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .where('senderId', '==', user.uid);

          const snapshot = await messagesRef.get();
          let unreadCount = 0;

          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (!data.readBy || !data.readBy[currentUser.uid]) {
              unreadCount++;
            }
          });

          counts[user.uid] = unreadCount;
        } catch (error) {
          console.error(`Error fetching unread count for user ${user.uid}:`, error);
          counts[user.uid] = 0;
        }
      }
      setUnreadCounts(counts);
    };

    fetchUnreadCounts();
  }, [currentUser?.uid, users]);

  // Listen for real-time message updates to update unread counts
  useEffect(() => {
    if (!currentUser?.uid || users.length === 0) return;

    const unsubscribes = [];

    users.forEach((user) => {
      const chatId =
        currentUser.uid < user.uid
          ? `${currentUser.uid}_${user.uid}`
          : `${user.uid}_${currentUser.uid}`;

      const messagesRef = firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .where('senderId', '==', user.uid);

      const unsubscribe = messagesRef.onSnapshot(
        (snapshot) => {
          let unreadCount = 0;
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (!data.readBy || !data.readBy[currentUser.uid]) {
              unreadCount++;
            }
          });

          setUnreadCounts((prev) => ({
            ...prev,
            [user.uid]: unreadCount,
          }));
        },
        (error) => {
          console.error(`Error listening to messages for user ${user.uid}:`, error);
        }
      );

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [currentUser?.uid, users]);

  // Filter users
  const filteredUsers = users.filter((u) =>
    (u?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open chat with selected user
  const openChat = (secondUser) => {
    if (!currentUser?.uid) {
      Alert.alert('Authentication Error', 'Please log in to start a chat.');
      return;
    }

    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Authentication Error', 'Your session has expired. Please log in again.');
      return;
    }

    // Clear unread count for this user
    setUnreadCounts((prev) => ({
      ...prev,
      [secondUser.uid]: 0,
    }));

    navigation.navigate('ExpertChatMsg', {
      current_user: currentUser.uid,
      second_user: secondUser.uid,
      secondUserName: secondUser.name,
      secondUserPic: secondUser.dpImage,
    });
  };

  // Default image
  const getDefaultImage = (role) => {
    if (role === 'farmer') {
      return require('../../../images/Farmerimg.png');
    } else if (role === 'expert') {
      return require('../../../images/Expertimg.png');
    }
    return require('../../../images/chdummyimg.png');
  };

  // Navigate to own profile
  const openOwnProfile = () => {
    if (!userProfile) return;
    navigation.navigate('ExpertChatDes', {
      chatName: userProfile.name || 'My Profile',
      chatPhone: userProfile.phoneNumber || 'No Phone',
      chatImage: userProfile.dpImage || null,
    });
  };

  // Render chat item
  const renderItem = ({ item }) => {
    const unreadCount = unreadCounts[item.uid] || 0;

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
        <Image
          source={item.dpImage ? { uri: item.dpImage } : getDefaultImage(item.role)}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phoneNumber || 'No Phone'}</Text>
        </View>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../images/background.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Chats</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SettingStack')}>
            <Icon name="settings" size={26} color="#031501ff" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#888" />
          <TextInput
            placeholder="Search users..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* User list */}
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.uid}
          style={{ flex: 1, paddingHorizontal: 10, marginTop: 10 }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#031501ff' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    elevation: 2,
    height: 45,
  },
  searchInput: { flex: 1, marginLeft: 8, color: '#000' },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  userInfo: { flex: 1, marginLeft: 10 },
  name: { fontWeight: 'bold', fontSize: 15, color: '#000' },
  phone: { fontSize: 12, color: '#555' },
  unreadBadge: {
    backgroundColor: '#006644',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
