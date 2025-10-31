import React, { useEffect, useState, useMemo, useCallback } from 'react';
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

// Helper function to get the canonical chat ID
const getChatId = (uid1, uid2) => (uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`);

// --- Dummy Image Imports (Adjust paths as necessary) ---
// NOTE: These paths MUST be correct for your project structure.
const FarmerImage = require('../../../images/Farmerimg.png');
const ExpertImage = require('../../../images/Expertimg.png');
const DummyImage = require('../../../images/chdummyimg.png');

export default function ChatHomeScreen({ navigation }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [chatPartners, setChatPartners] = useState([]); // Will store users with existing chats
    const [allUsers, setAllUsers] = useState({}); // Map of UID -> User Data for quick lookup
    const [searchQuery, setSearchQuery] = useState('');
    const [unreadCounts, setUnreadCounts] = useState({});
    const [loading, setLoading] = useState(true);

    // Get default image based on user role
    const getDefaultImage = (role) => {
        if (role === 'farmer') return FarmerImage;
        if (role === 'expert') return ExpertImage;
        return DummyImage;
    };

    /**
     * ## 1. Fetch Current User, Role, and All Potential Users
     * Fetches logged-in user details and all potential chat partners based on role.
     */
    useEffect(() => {
        const user = auth().currentUser;
        if (!user) {
            Alert.alert('Authentication Error', 'Please log in to access chat features.');
            setLoading(false);
            return;
        }

        const currentUid = user.uid;
        setCurrentUser({ uid: currentUid, name: user.displayName, email: user.email });

        // Listener for current user's profile to get role
        const unsubscribeUser = firestore().collection('users').doc(currentUid).onSnapshot(
            (doc) => {
                if (!doc.exists) return;
                const userData = doc.data();
                const role = userData.role || "farmer";
                setCurrentUser(prev => ({ ...prev, role, dpImage: userData.dpImage, phoneNumber: userData.phoneNumber }));

                // Fetch all potential chat users (experts + farmers)
                const usersQuery = firestore().collection('users').where("role", "in", ["farmer", "expert"]);
                
                const unsubscribeUsers = usersQuery.onSnapshot(
                    (querySnap) => {
                        const userMap = {};
                        querySnap.docs.forEach((d) => {
                            const data = d.data();
                            if (data.uid !== currentUid) { // Exclude self
                                userMap[data.uid] = data;
                            }
                        });
                        setAllUsers(userMap);
                        setLoading(false);
                    },
                    (error) => {
                        console.error("Error fetching all users:", error);
                        setLoading(false);
                    }
                );

                return () => unsubscribeUsers();
            },
            (error) => {
                console.error("Error fetching user role:", error);
                setLoading(false);
            }
        );

        return () => unsubscribeUser();
    }, []);

    /**
     * ## 2. Fetch Chat Partners and Unread Counts
     * Listens to the 'chats' collection to identify partners with existing messages.
     * Then sets up real-time listeners for unread counts for *only* those partners.
     */
    useEffect(() => {
        if (!currentUser?.uid || Object.keys(allUsers).length === 0) return;

        const currentUid = currentUser.uid;
        const potentialPartnerUids = Object.keys(allUsers);
        const unreadUnsubscribes = [];

        // Identify partners based on existing chats (simulated by checking if the chat ID exists)
        // Note: Firestore doesn't allow querying for document IDs in a collection directly,
        // so we rely on the logic in section 3 to determine partners by unread counts/messages.
        // The most robust way to find *all* chat partners in Firestore without complex database changes 
        // is to check the `messages` subcollection.

        // --- Simplified Partner Discovery & Unread Count Listener Setup ---
        // Instead of querying 'chats' collection (which might require complex security rules/indexes),
        // we iterate through *all* potential partners and check for unread messages. 
        // A non-zero unread count implies an existing chat.

        const setupPartnerListeners = () => {
            const tempUnsubscribes = [];

            potentialPartnerUids.forEach(partnerUid => {
                const chatId = getChatId(currentUid, partnerUid);
                const partnerData = allUsers[partnerUid];
                
                // Listener only for messages *sent by the partner*
                const messagesRef = firestore()
                    .collection('chats')
                    .doc(chatId)
                    .collection('messages')
                    .where('senderId', '==', partnerUid)
                    .orderBy('createdAt', 'desc')
                    .limit(50); // Limit to recent messages for performance/accuracy

                const unsubscribe = messagesRef.onSnapshot(
                    (snapshot) => {
                        let unreadCount = 0;
                        let hasMessages = false;
                        
                        snapshot.docs.forEach(doc => {
                            hasMessages = true; // At least one message exists from this partner
                            const data = doc.data();
                            // Correct unread logic: Message is unread if readBy field doesn't exist 
                            // or doesn't contain an entry for the current user's UID.
                            if (!data.readBy || !data.readBy[currentUid]) {
                                unreadCount++;
                            }
                        });

                        // Only add/keep the partner if there is at least one message (hasMessages is true)
                        setChatPartners(prevPartners => {
                            const isExisting = prevPartners.some(p => p.uid === partnerUid);
                            
                            if (hasMessages && !isExisting) {
                                // Add new partner who has a message
                                return [...prevPartners, partnerData];
                            } else if (!hasMessages && isExisting && unreadCount === 0) {
                                // Remove partner if no messages are found anymore (highly unlikely in a real app)
                                return prevPartners.filter(p => p.uid !== partnerUid);
                            }
                            // Return existing list if no change in partnership status
                            return prevPartners;
                        });

                        // Update unread count
                        setUnreadCounts(prev => ({
                            ...prev,
                            [partnerUid]: unreadCount
                        }));
                    },
                    (error) => {
                        console.error(`Error listening to messages for user ${partnerUid}:`, error);
                    }
                );
                
                tempUnsubscribes.push(unsubscribe);
            });
            
            return tempUnsubscribes;
        };

        const unsubscribes = setupPartnerListeners();

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [currentUser?.uid, allUsers]);


    /**
     * ## 3. Search and Filtering Logic
     * Filters the `chatPartners` list based on the search query.
     */
    const filteredUsers = useMemo(() => {
        if (!searchQuery) {
            // Sort partners by unread count descending for prominence
            return chatPartners.sort((a, b) => (unreadCounts[b.uid] || 0) - (unreadCounts[a.uid] || 0));
        }
        
        const lowerCaseQuery = searchQuery.toLowerCase();
        
        return chatPartners
            .filter(u => u?.name?.toLowerCase().includes(lowerCaseQuery))
            // Apply sorting to the filtered list as well
            .sort((a, b) => (unreadCounts[b.uid] || 0) - (unreadCounts[a.uid] || 0));
            
    }, [chatPartners, searchQuery, unreadCounts]);

    /**
     * ## 4. Navigation and Unread Count Clearing
     */
    const openChat = useCallback((secondUser) => {
        if (!currentUser?.uid) {
            Alert.alert('Authentication Error', 'Please log in to start a chat.');
            return;
        }

        // Optimistically clear unread count for UI
        setUnreadCounts(prev => ({
            ...prev,
            [secondUser.uid]: 0
        }));

        navigation.navigate('ChatMsg', {
            current_user: currentUser.uid,
            second_user: secondUser.uid,
            secondUserName: secondUser.name,
            secondUserPic: secondUser.dpImage,
        });
    }, [currentUser?.uid, navigation]);

    /**
     * ## 5. Rendering Components
     */
    const renderItem = ({ item }) => {
        const unreadCount = unreadCounts[item.uid] || 0;
        
        return (
            <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
                <Image
                    source={item.dpImage ? { uri: item.dpImage } : getDefaultImage(item.role)}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <Text style={[styles.name, unreadCount > 0 && { fontWeight: '800' }]}>{item.name}</Text>
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

    if (loading || !currentUser) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading Chats...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require("../../../images/background.jpg")}
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
                    ListEmptyComponent={() => (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: '#555' }}>No chats found.</Text>
                            {searchQuery.length > 0 && (
                                <Text style={{ color: '#555' }}>Try adjusting your search term.</Text>
                            )}
                        </View>
                    )}
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