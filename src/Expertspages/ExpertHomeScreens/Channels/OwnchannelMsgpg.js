import React, { useState, useEffect, useCallback, useMemo } from "react";

import {
  SafeAreaView,
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Icon from "react-native-vector-icons/Ionicons";
import Contacts from "react-native-contacts";
import { launchImageLibrary } from "react-native-image-picker";
import Geolocation from 'react-native-geolocation-service';
import { Linking } from 'react-native';

const CLOUDINARY_CLOUD_NAME = 'dumgs9cp4';
const CLOUDINARY_UPLOAD_PRESET = 'react_native_uploads';

export default function OwnChannelMsgScreen({ route, navigation }) {
  const { channelId } = route.params || {};
  const currentUser = auth().currentUser?.uid;

  const [channelInfo, setChannelInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [fullImageUri, setFullImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  // Fetch channel info
  useEffect(() => {
    const fetchChannelData = async () => {
      setLoading(true);
      try {
        const channelDoc = await firestore().collection('channels').doc(channelId).get();
        if (!channelDoc.exists) {
          Alert.alert('Error', 'Channel not found!');
          setLoading(false);
          return;
        }
        const data = channelDoc.data();
        setChannelInfo({
          id: channelId,
          name: data.name || 'Unnamed Channel',
          description: data.description || 'No description available.',
          imageUrl: data.imageUrl || null,
          createdBy: data.createdBy || 'Unknown',
        });
      } catch (error) {
        Alert.alert('Error', 'Could not fetch channel info. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchChannelData();
  }, [channelId]);

  // Real-time messages listener
  useEffect(() => {
    if (!channelId) return;
    const unsubscribe = firestore()
      .collection('channels')
      .doc(channelId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const allMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text || '',
            image: data.imageUrl,
            createdAt: data.createdAt?.toDate() || new Date(),
            user: {
              _id: data.senderId,
              name: data.senderName || 'Member',
              avatar: data.senderPic || undefined,
            },
            readBy: data.readBy || {},
            isRead: !!(data.readBy && data.readBy[currentUser]),
            type: data.type || 'text',
            documentUrl: data.documentUrl,
            fileName: data.fileName,
            contactName: data.contactName,
            contactPhone: data.contactPhone,
            latitude: data.latitude,
            longitude: data.longitude,
            locationUrl: data.locationUrl,
            audioUrl: data.audioUrl,
            durationMs: data.durationMs,
          };
        });
        setMessages(allMessages);
      }, () => {
        Alert.alert('Error', 'Failed to load messages.');
      });
    return () => unsubscribe();
  }, [channelId, currentUser]);

  // Mark messages as read for current user
  useEffect(() => {
    const markAsRead = async () => {
      const unread = messages.filter(
        msg => msg.user._id !== currentUser && !msg.readBy?.[currentUser]
      );
      if (!unread.length) return;
      const batch = firestore().batch();
      unread.forEach(msg => {
        const msgRef = firestore()
          .collection('channels')
          .doc(channelId)
          .collection('messages')
          .doc(msg._id);
        batch.update(msgRef, { [`readBy.${currentUser}`]: firestore.FieldValue.serverTimestamp() });
      });
      try { await batch.commit(); } catch {}
    };
    markAsRead();
  }, [messages, currentUser, channelId]);

  // Send text message (to channel)
  const sendTextMessage = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");
    try {
      await firestore()
        .collection('channels')
        .doc(channelId)
        .collection('messages')
        .add({
          text,
          senderId: currentUser,
          senderName: auth().currentUser?.displayName || 'You',
          senderPic: auth().currentUser?.photoURL || null,
          createdAt: firestore.FieldValue.serverTimestamp(),
          readBy: { [currentUser]: firestore.FieldValue.serverTimestamp() },
          type: 'text',
        });
    } catch {
      Alert.alert('Error', 'Failed to send message.');
    }
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (uri, filename, mimeType) => {
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const data = new FormData();
    data.append('file', { uri, name: filename || `upload_${Date.now()}`, type: mimeType || 'image/jpeg' });
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(endpoint, { method: 'POST', body: data });
    const json = await res.json();
    if (!json.secure_url) throw new Error('Upload failed');
    return json.secure_url;
  };

  // Modal: Pick multiple images
  const pickImages = async () => {
    try {
      const resp = await launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 10 });
      if (resp.didCancel) return;
      if (resp?.assets && resp.assets.length > 0) {
        setSelectedImages(resp.assets.map(a => ({ uri: a.uri, fileName: a.fileName, type: a.type })));
        setModalVisible(true);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick images.');
    }
  };

  // Send images to channel
  const sendSelectedImages = async () => {
    if (!selectedImages.length) return;
    setIsUploadingImage(true);

    try {
      for (const asset of selectedImages) {
        const url = await uploadToCloudinary(asset.uri, asset.fileName, asset.type);
        const messageId = `${Date.now()}_${currentUser}`;
        await firestore()
          .collection('channels')
          .doc(channelId)
          .collection('messages')
          .doc(messageId)
          .set({
            type: 'image',
            imageUrl: url,
            senderId: currentUser,
            senderName: auth().currentUser?.displayName || 'You',
            senderPic: auth().currentUser?.photoURL || null,
            createdAt: firestore.FieldValue.serverTimestamp(),
            readBy: { [currentUser]: firestore.FieldValue.serverTimestamp() },
          });
      }
      setModalVisible(false);
      setSelectedImages([]);
    } catch {
      Alert.alert('Error', 'Failed to send images.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Document picker logic (mocked)
  const handlePickDocument = async () => {
    Alert.alert("Document", "Document picker not implemented in this snippet.");
  };

  // Contact sharing
  const handleShareContact = async () => {
    try {
      let perm = await Contacts.checkPermission();
      if (perm === 'undefined' || perm === 'denied') {
        perm = await Contacts.requestPermission();
      }
      if (perm !== 'authorized') {
        return Alert.alert(
          'Permission needed',
          'Contacts permission is required to pick and send a contact. You can enable it in App Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings?.() },
          ]
        );
      }
      setContactsLoading(true);
      const list = await Contacts.getAll();
      setContacts(list);
      setContactsModalVisible(true);
      setModalVisible(false);
    } catch {
      Alert.alert('Error', 'Failed to load contacts.');
    } finally {
      setContactsLoading(false);
    }
  };

  const handleSendContact = async (contact) => {
    try {
      const name = contact.displayName || `${contact.givenName || ''} ${contact.familyName || ''}`.trim();
      const phone = contact.phoneNumbers?.[0]?.number || '';
      if (!phone && !name) return Alert.alert('Contacts', 'Selected contact has no name or phone.');
      await firestore().collection('channels').doc(channelId).collection('messages').add({
        type: 'contact',
        contactName: name,
        contactPhone: phone,
        senderId: currentUser,
        senderName: auth().currentUser?.displayName || 'You',
        senderPic: auth().currentUser?.photoURL || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        readBy: { [currentUser]: firestore.FieldValue.serverTimestamp() },
      });
      setContactsModalVisible(false);
    } catch {
      Alert.alert('Error', 'Failed to share contact.');
    }
  };

  // Location sharing
  const handleShareLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return Alert.alert('Permission', 'Location permission is required.');
      }
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          await firestore().collection('channels').doc(channelId).collection('messages').add({
            type: 'location',
            latitude,
            longitude,
            locationUrl: mapUrl,
            senderId: currentUser,
            senderName: auth().currentUser?.displayName || 'You',
            senderPic: auth().currentUser?.photoURL || null,
            createdAt: firestore.FieldValue.serverTimestamp(),
            readBy: { [currentUser]: firestore.FieldValue.serverTimestamp() },
          });
          setModalVisible(false);
        },
        () => { Alert.alert('Error', 'Failed to get location.'); },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch {
      Alert.alert('Error', 'Failed to share location.');
    }
  };

  // Full-screen image modal
  const FullImageModal = () => (
    <Modal visible={!!fullImageUri} animationType="fade" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <TouchableOpacity
          onPress={() => setFullImageUri(null)}
          style={{
            position: "absolute",
            top: 40,
            left: 20,
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 20,
            padding: 6,
          }}
        >
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri: fullImageUri }}
          resizeMode="contain"
          style={{ flex: 1, width: "100%", height: "100%" }}
        />
      </View>
    </Modal>
  );

  // Contacts picker modal (local state, debounce, memo; per-contact Send)
  const ContactsModal = React.memo(() => {
    const [searchRaw, setSearchRaw] = useState('');
    const [search, setSearch] = useState('');
    const inputRef = React.useRef(null);

    useEffect(() => {
      const t = setTimeout(() => setSearch(searchRaw.trim()), 150);
      return () => clearTimeout(t);
    }, [searchRaw]);

    useEffect(() => {
      if (contactsModalVisible) setTimeout(() => inputRef.current?.focus(), 0);
    }, [contactsModalVisible]);

    const filtered = useMemo(() => {
      const q = search.toLowerCase();
      if (!q) return contacts;
      return contacts.filter(c => {
        const name = (c.displayName || `${c.givenName || ''} ${c.familyName || ''}`).toLowerCase();
        const phonesJoined = (c.phoneNumbers || []).map(p => p.number).join(' ').toLowerCase();
        return name.includes(q) || phonesJoined.includes(q);
      });
    }, [contacts, search]);

    return (
      <Modal visible={contactsModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.plusModalContainer}>
            <View style={{ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.modalTitle}>Select Contact</Text>
              <TouchableOpacity onPress={() => setContactsModalVisible(false)} style={styles.closeIconBtn}>
                <Icon name="close" size={22} color="#075E54" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Search contacts"
              placeholderTextColor="#888"
              value={searchRaw}
              onChangeText={setSearchRaw}
              style={styles.searchInput}
              autoFocus
              blurOnSubmit={false}
              ref={inputRef}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {contactsLoading ? (
              <ActivityIndicator color="#075E54" />
            ) : (
              <>
                <FlatList
                  data={filtered}
                  keyExtractor={(item) => item.recordID}
                  style={{ alignSelf: 'stretch', maxHeight: 420 }}
                  keyboardShouldPersistTaps="always"
                  keyboardDismissMode="on-drag"
                  removeClippedSubviews={false}
                  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
                  ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                      <Icon name="search" size={36} color="#bbb" />
                      <Text style={styles.emptyTitle}>No contacts found</Text>
                      <Text style={styles.emptySub}>Try another search query</Text>
                    </View>
                  )}
                  renderItem={({ item }) => {
                    const name = item.displayName || `${item.givenName || ''} ${item.familyName || ''}`.trim();
                    const phones = item.phoneNumbers || [];
                    const initials = (name || 'U').trim().split(' ').map(x => x[0]).slice(0,2).join('').toUpperCase();
                    return (
                      <View style={styles.contactRow}>
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.contactName}>{name || 'Unnamed'}</Text>
                          {phones.slice(0,1).map((p, idx) => (
                            <Text key={idx} style={styles.contactPhone}>{p.label ? `${p.label}: ` : ''}{p.number}</Text>
                          ))}
                        </View>
                        <TouchableOpacity
                          onPress={() => handleSendContact(item)}
                          style={styles.miniSendBtnGreen}
                          activeOpacity={0.9}
                        >
                          <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </>
            )}
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setContactsModalVisible(false)}>
              <Text style={{ color: '#075E54', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  });

  // Plus modal in bottom bar
  const PlusModal = () => (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.plusModalContainer}>
          <Text style={styles.modalTitle}>Choose Action</Text>
          <View style={styles.plusModalOptions}>
            <TouchableOpacity style={styles.plusOptionBtn} onPress={pickImages}>
              <Icon name="image-outline" size={28} color="#075E54" />
              <Text style={styles.plusOptionText}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.plusOptionBtn} onPress={handleShareContact}>
              <Icon name="person-add-outline" size={28} color="#075E54" />
              <Text style={styles.plusOptionText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.plusOptionBtn} onPress={handlePickDocument}>
              <Icon name="document-outline" size={28} color="#075E54" />
              <Text style={styles.plusOptionText}>Document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.plusOptionBtn} onPress={handleShareLocation}>
              <Icon name="location-outline" size={28} color="#075E54" />
              <Text style={styles.plusOptionText}>Location</Text>
            </TouchableOpacity>
          </View>
          {selectedImages.length > 0 && (
            <>
              <FlatList
                data={selectedImages}
                keyExtractor={(_, idx) => idx.toString()}
                horizontal
                style={{ marginVertical: 10 }}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: 70, height: 70, marginRight: 8, borderRadius: 8, borderWidth: 2, borderColor: '#075E54' }}
                  />
                )}
              />
              <TouchableOpacity
                style={styles.modalSendBtn}
                disabled={isUploadingImage}
                onPress={sendSelectedImages}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>{isUploadingImage ? "Sending..." : "Send"}</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={styles.modalCancelBtn}
            onPress={() => {
              setModalVisible(false);
              setSelectedImages([]);
            }}>
            <Text style={{ color: "#075E54", fontWeight: '600' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading || !channelInfo) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#006644" />
        <Text style={styles.loaderText}>Loading Channel Info...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FullImageModal />
      <PlusModal />
      <ContactsModal />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("OwnChannelDescription", { channelId: channelInfo.id })
          }
        >
          <Image
            source={
              channelInfo.imageUrl
                ? { uri: channelInfo.imageUrl }
                : require("../../../images/chdummyimg.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.channelName}>{channelInfo.name}</Text>
          <Text style={styles.channelDesc} numberOfLines={1}>
            {channelInfo.description}
          </Text>
        </View>
      </View>

      {/* Chat Section */}
      <GiftedChat
        messages={messages}
        user={{ _id: currentUser }}
        showAvatarForEveryMessage
        alwaysShowSend
        scrollToBottom
        renderBubble={(props) => {
          const { currentMessage } = props;
          const isCurrentUser = currentMessage.user._id === currentUser;
          return (
            <View style={[styles.bubbleWrapper, { alignSelf: isCurrentUser ? 'flex-end' : 'flex-start' }]}>
              {currentMessage.text && (
                <Bubble
                  {...props}
                  wrapperStyle={{
                    right: styles.rightBubble,
                    left: styles.leftBubble,
                  }}
                  textStyle={{
                    right: styles.rightText,
                    left: styles.leftText,
                  }}
                  renderTime={() => null}
                />
              )}
              {currentMessage.image && (
                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => setFullImageUri(currentMessage.image)}
                >
                  <Image
                    source={{ uri: currentMessage.image }}
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: 8,
                      marginTop: 4,
                      alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                    }}
                  />
                </TouchableOpacity>
              )}
              {currentMessage.type === 'contact' && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    if (currentMessage.contactPhone) {
                      Linking.openURL(`tel:${currentMessage.contactPhone}`);
                    }
                  }}
                  style={[isCurrentUser ? styles.rightBubble : styles.leftBubble, styles.contactBubble]}
                >
                  <View style={styles.contactInlineRow}>
                    <View style={styles.contactInlineIcon}>
                      <Icon name="person" size={18} color="#075E54" />
                    </View>
                    <Text style={styles.contactInlineName} numberOfLines={1}>
                      {currentMessage.contactName || 'Contact'}
                    </Text>
                  </View>
                  {!!currentMessage.contactPhone && (
                    <>
                      <View style={styles.contactDivider} />
                      <Text style={styles.contactInlinePhone}>{currentMessage.contactPhone}</Text>
                    </>
                  )}
                  <View style={styles.timeTickContainer}>
                    <Text style={styles.timeText}>{new Date(currentMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    {isCurrentUser && (
                      <Text style={[styles.tickText, { color: currentMessage.isRead ? '#34B7F1' : '#999' }]}>
                        {currentMessage.isRead ? '✓✓' : '✓'}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              {currentMessage.type !== 'contact' && (
                <View style={[styles.timeTickContainer, isCurrentUser ? styles.sentContainer : styles.receivedContainer]}>
                  <Text style={styles.timeText}>{new Date(currentMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  {isCurrentUser && (
                    <Text style={[styles.tickText, { color: currentMessage.isRead ? '#34B7F1' : '#999' }]}>
                      {currentMessage.isRead ? '✓✓' : '✓'}
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
        }}
        renderInputToolbar={() => (
          <View style={styles.bottomBar}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.plusIconBtn}>
              <Icon name="add-circle" size={36} color="#075E54" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              placeholderTextColor="gray"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendTextMessage}
            />
            <TouchableOpacity
              onLongPress={() => Alert.alert('Unavailable', 'Voice recording is temporarily disabled.')}
              style={{ paddingHorizontal: 8 }}
            >
              <Icon name={isRecording ? 'mic' : 'mic-outline'} size={24} color={isRecording ? '#d00' : '#075E54'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendTextMessage}>
              <Icon name="send" size={24} color="#075E54" style={{ marginHorizontal: 5 }} />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECE5DD" },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#ECE5DD",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: { marginTop: 16, color: "#006644", fontWeight: "bold" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#006644",
    elevation: 4,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 10 },
  channelName: { fontSize: 16, fontWeight: "600", color: "#fff" },
  channelDesc: { fontSize: 13, color: "#e6e6e6" },
  rightBubble: {
    backgroundColor: "#DCF8C6",
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
    paddingRight: 45,
    paddingVertical: 6,
    paddingLeft: 10,
    maxWidth: "80%",
  },
  leftBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginLeft: 8,
    marginBottom: 6,
    paddingRight: 45,
    paddingVertical: 6,
    paddingLeft: 10,
    maxWidth: "80%",
  },
  rightText: { color: "#000", fontSize: 15 },
  leftText: { color: "#000", fontSize: 15 },
  bubbleWrapper: { position: "relative", marginBottom: 2 },
  timeTickContainer: { position: "absolute", bottom: 4, right: 12, flexDirection: "row", alignItems: "center" },
  timeText: { fontSize: 10, color: "#667781", opacity: 0.9, marginRight: 2 },
  tickText: { fontSize: 11 },
  sentContainer: { right: 12 },
  receivedContainer: { right: 12 },
  plusIconBtn: { paddingHorizontal: 6, paddingVertical: 2 },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ece5dd",
    padding: 5,
    elevation: 2,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#e9e9e1",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    fontSize: 16,
  },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  plusModalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 16, padding: 20, alignItems: "center", elevation: 6 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 18, color: "#222" },
  plusModalOptions: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 12 },
  plusOptionBtn: { flex: 1, alignItems: "center", marginHorizontal: 10, paddingVertical: 8 },
  plusOptionText: { fontSize: 13, color: "#075E54", marginTop: 5, fontWeight: "600" },
  modalCancelBtn: { marginTop: 18, paddingVertical: 8, paddingHorizontal: 22, borderRadius: 8, backgroundColor: "#e6f3ef" },
  modalSendBtn: { marginTop: 5, paddingVertical: 8, paddingHorizontal: 22, borderRadius: 8, backgroundColor: "#075E54", alignSelf: "flex-end" },
  searchInput: { alignSelf: 'stretch', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8 },
  contactName: { fontSize: 15, fontWeight: '600', color: '#222' },
  contactPhone: { fontSize: 13, color: '#555', marginTop: 2 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { marginTop: 8, fontSize: 16, fontWeight: '700', color: '#666' },
  emptySub: { fontSize: 13, color: '#999', marginTop: 2 },
  avatarCircle: { width: 36, height: 36, borderRadius: 18, marginRight: 10, backgroundColor: '#d9efe6', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#075E54', fontWeight: '700' },
  miniSendBtnGreen: { backgroundColor: '#006644', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  contactInlineRow: { flexDirection: 'row', alignItems: 'center' },
  contactInlineIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#e6f3ef', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  contactInlineName: { fontSize: 15, fontWeight: '700', color: '#102a43' },
  contactInlinePhone: { fontSize: 13, color: '#4a5568', marginTop: 1 },
  contactBubble: { paddingRight: 16, paddingTop: 6, paddingBottom: 6, marginTop: 4 },
  contactDivider: { height: 1, backgroundColor: '#eee', marginVertical: 4 },
  closeIconBtn: { position: 'absolute', top: 16, right: 16, zIndex: 10 },
});