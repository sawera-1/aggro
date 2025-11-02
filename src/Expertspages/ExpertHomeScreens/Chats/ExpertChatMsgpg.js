import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  SafeAreaView,
  Alert,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Linking,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import Contacts from 'react-native-contacts';
import { launchImageLibrary } from 'react-native-image-picker';
import LocationPiker from './LocationPikerpg';
import VoiceRecorderInput from './VoiceRecorderInput';
import VoiceMessagePlayer from './VoiceMessagePlayer';

export default function ExpertChatScreen({ route, navigation }) {

  const { current_user, second_user, secondUserName, secondUserPic } = route.params;

  const [messages, setMessages] = useState([]);
  const [secondUserPhone, setSecondUserPhone] = useState('Loading...');
  const [dpImage, setDpImage] = useState(secondUserPic);
  // State to toggle between text input and custom voice input
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [fullImageUri, setFullImageUri] = useState(null);
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const CLOUDINARY_CLOUD_NAME = 'dumgs9cp4';
  const CLOUDINARY_UPLOAD_PRESET = 'react_native_uploads';

  // Removed parent-level search state and effects to prevent re-renders while typing in ContactsModal

  const chatId =
    current_user < second_user
      ? `${current_user}_${second_user}`
      : `${second_user}_${current_user}`;

  // Fetch receiver details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const doc = await firestore().collection('users').doc(second_user).get();
        if (doc.exists) {
          const data = doc.data();
          setSecondUserPhone(data.phone || data.phoneNumber || data.phonenumber || 'N/A');
          setDpImage(data.dpImage || secondUserPic);
        } else setSecondUserPhone('N/A');
      } catch {
        setSecondUserPhone('N/A');
      }
    };
    fetchUserDetails();
  }, [second_user, secondUserPic]);

  

  // Realtime messages listener
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const allMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text || '',
            image: data.image || data.imageUrl,
            createdAt: data.createdAt?.toDate() || new Date(),
            user: {
              _id: data.senderId,
              name: data.senderId === current_user ? 'You' : secondUserName || 'Unknown',
              avatar: dpImage || undefined,
            },
            readBy: data.readBy || {},
            isRead: !!(data.readBy && data.readBy[second_user]),
            isDelivered: !!(data.readBy && data.readBy[current_user]),
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
  }, [chatId, current_user, secondUserName, dpImage, second_user]);

  // Mark messages as read whenever messages change and chat is focused
  useEffect(() => {
    const markAsRead = async () => {
      if (!navigation.isFocused()) return;
      const unread = messages.filter(msg =>
        msg.user._id !== current_user && !msg.readBy?.[current_user]
      );
      if (!unread.length) return;

      const batch = firestore().batch();
      unread.forEach(msg => {
        const msgRef = firestore().collection('chats').doc(chatId).collection('messages').doc(msg._id);
        batch.update(msgRef, { [`readBy.${current_user}`]: firestore.FieldValue.serverTimestamp() });
      });

      try {
        await batch.commit();
      } catch {}
    };
    markAsRead();
  }, [messages, current_user, chatId, navigation]);

  // Send text message
  const onSend = useCallback(async (msgs = []) => {
    if (!msgs?.length || !msgs[0].text?.trim()) return;

    const msg = msgs[0];
    const newMessage = {
      _id: `${Date.now()}_${current_user}`,
      text: msg.text.trim(),
      senderId: current_user,
      receiverId: second_user,
      createdAt: new Date(),
      user: { _id: current_user, name: 'You', avatar: dpImage },
    };

    setMessages(prev => GiftedChat.append(prev, [newMessage]));

    try {
      const chatRef = firestore().collection('chats').doc(chatId);
      const chatDoc = await chatRef.get();

      if (!chatDoc.exists) {
        await chatRef.set({
          participants: [current_user, second_user],
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      await chatRef.collection('messages').add({
        text: newMessage.text,
        senderId: current_user,
        receiverId: second_user,
        createdAt: firestore.FieldValue.serverTimestamp(),
        readBy: { [current_user]: firestore.FieldValue.serverTimestamp() },
      });
    } catch {
      Alert.alert('Error', 'Failed to send message.');
    }
  }, [current_user, second_user, chatId, dpImage]);

  // Send location message
  const handleSendLocation = async ({ latitude, longitude }) => {
    if (!latitude || !longitude) return;
    const messageId = `${Date.now()}_${current_user}`;
    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const optimistic = {
      _id: messageId,
      text: '',
      createdAt: new Date(),
      user: { _id: current_user, name: 'You', avatar: dpImage },
      type: 'location',
      latitude,
      longitude,
      locationUrl,
    };
    setMessages(prev => GiftedChat.append(prev, [optimistic]));

    try {
      const chatRef = firestore().collection('chats').doc(chatId);
      const chatDoc = await chatRef.get();
      if (!chatDoc.exists) {
        await chatRef.set({ participants: [current_user, second_user], createdAt: firestore.FieldValue.serverTimestamp() });
      }
      await chatRef.collection('messages').doc(messageId).set({
        type: 'location',
        latitude,
        longitude,
        locationUrl,
        senderId: current_user,
        receiverId: second_user,
        createdAt: firestore.FieldValue.serverTimestamp(),
        readBy: { [current_user]: firestore.FieldValue.serverTimestamp() },
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to send location.');
      setMessages(prev => prev.filter(m => m._id !== messageId));
    }
  };

  // Cloudinary upload
  const uploadToCloudinary = async (uri, filename, mimeType, resourceType = 'auto') => {
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
    const data = new FormData();
    const normalizedUri = uri && uri.startsWith('file://') ? uri : (uri ? `file://${uri}` : uri);
    data.append('file', { uri: normalizedUri, name: filename || `upload_${Date.now()}`, type: mimeType || 'application/octet-stream' });
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(endpoint, { method: 'POST', body: data });
    const json = await res.json();
    if (!res.ok || !json.secure_url) throw new Error(json.error?.message || `Cloudinary upload failed (${res.status})`);
    return json.secure_url;
  };

  // Audio-specific upload returning metadata
  const uploadAudioToCloudinary = async (uri, filename, mimeType) => {
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;
    const data = new FormData();
    const normalizedUri = uri && uri.startsWith('file://') ? uri : (uri ? `file://${uri}` : uri);
    data.append('file', { uri: normalizedUri, name: filename || `upload_${Date.now()}`, type: mimeType || 'application/octet-stream' });
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(endpoint, { method: 'POST', body: data });
    const json = await res.json();
    if (!res.ok || !json.secure_url) throw new Error(json.error?.message || `Cloudinary upload failed (${res.status})`);
    return { url: json.secure_url, duration: json.duration };
  };

  // Modal: Pick multiple images, then send on send btn
  const pickImages = async () => {
    try {
      setImageLoading(true);
      const resp = await launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 10 });
      if (resp.didCancel) return;
      if (resp?.assets && resp.assets.length > 0) {
        setSelectedImages(resp.assets.map(a => ({ uri: a.uri, fileName: a.fileName, type: a.type })));
      }
    } catch {
      Alert.alert('Error', 'Failed to pick images.');
    } finally {
      setImageLoading(false);
    }
  };

  const sendSelectedImages = async () => {
    if (!selectedImages.length) return;
    setIsUploadingImage(true);

    try {
      for (const asset of selectedImages) {
        const url = await uploadToCloudinary(asset.uri, asset.fileName || `image_${Date.now()}.jpg`, asset.type || 'image/jpeg');
        const messageId = `${Date.now()}_${current_user}`;
        const optimistic = {
          _id: messageId,
          image: url,
          text: '',
          createdAt: new Date(),
          user: { _id: current_user, name: 'You', avatar: dpImage },
          type: 'image',
        };
        setMessages(prev => GiftedChat.append(prev, [optimistic]));

        await firestore().collection('chats').doc(chatId).collection('messages').doc(messageId).set({
          type: 'image',
          imageUrl: url,
          image: url,
          senderId: current_user,
          receiverId: second_user,
          createdAt: firestore.FieldValue.serverTimestamp(),
          readBy: { [current_user]: firestore.FieldValue.serverTimestamp() },
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
 

  // Contact logic
  const handleShareContact = async () => {
    try {
      // Cross-platform permission using react-native-contacts helpers
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
      await firestore().collection('chats').doc(chatId).collection('messages').add({
        type: 'contact',
        contactName: name,
        contactPhone: phone,
        senderId: current_user,
        receiverId: second_user,
        createdAt: firestore.FieldValue.serverTimestamp(),
        readBy: { [current_user]: firestore.FieldValue.serverTimestamp() },
      });
      setContactsModalVisible(false);
    } catch {
      Alert.alert('Error', 'Failed to share contact.');
    }
  };

  
  // Full-screen image modal
  const FullImageModal = () => (
    <Modal visible={!!fullImageUri} animationType="fade" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <TouchableOpacity
          onPress={() => setFullImageUri(null)}
          style={{
            position: 'absolute',
            top: 40,
            left: 20,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
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

  // Modal for plus icon
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
            
            <TouchableOpacity style={styles.plusOptionBtn} onPress={() => {
              setModalVisible(false);
              navigation.navigate('LocationPiker', {
                onPick: (coords) => handleSendLocation(coords),
              });
            }}>
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

  // Contacts picker modal
  const ContactsModal = React.memo(() => {
    const [searchRaw, setSearchRaw] = useState('');
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
      const t = setTimeout(() => setSearch(searchRaw.trim()), 150);
      return () => clearTimeout(t);
    }, [searchRaw]);

    useEffect(() => {
      if (contactsModalVisible) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
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
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={64}>
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
                    ListEmptyComponent={() => (
                      <View style={styles.emptyState}>
                        <Icon name="search" size={36} color="#bbb" />
                        <Text style={styles.emptyTitle}>No contacts found</Text>
                        <Text style={styles.emptySub}>Try another search query</Text>
                      </View>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
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
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  });

  const handleSendVoice = async (filePath, durationSeconds) => {
    if (!filePath) return Alert.alert('Error', 'Voice file path is missing.');

    const audioDurationMs = Math.round((durationSeconds || 0) * 1000);
    const filename = `voice_${current_user}_${Date.now()}.mp4`;
    const mimeType = Platform.OS === 'ios' ? 'audio/aac' : 'audio/mp4';

    const messageId = `${Date.now()}_${current_user}`;
    const optimistic = {
      _id: messageId,
      text: 'Sending Voice Message...',
      createdAt: new Date(),
      user: { _id: current_user, name: 'You', avatar: dpImage },
      type: 'voice',
      audioUrl: 'placeholder',
      durationMs: audioDurationMs,
    };
    setMessages(prev => GiftedChat.append(prev, [optimistic]));

    try {
      const uploadResult = await uploadAudioToCloudinary(filePath, filename, mimeType);
      const audioUrl = uploadResult.url;

      const msgData = {
        type: 'voice',
        audioUrl,
        durationMs: audioDurationMs,
        senderId: current_user,
        receiverId: second_user,
        createdAt: firestore.FieldValue.serverTimestamp(),
        readBy: { [current_user]: firestore.FieldValue.serverTimestamp() },
      };

      const chatRef = firestore().collection('chats').doc(chatId);
      const chatDoc = await chatRef.get();
      if (!chatDoc.exists) {
        await chatRef.set({
          participants: [current_user, second_user],
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      await chatRef.collection('messages').doc(messageId).set(msgData);
    } catch (error) {
      Alert.alert('Error', 'Failed to send voice message.');
      setMessages(prev => prev.filter(m => m._id !== messageId));
    }
  };

  const renderInputToolbar = (props) => {
    if (isRecordingMode) {
      return (
        <View style={styles.customInputToolbar}>
          <VoiceRecorderInput
            onSendVoice={handleSendVoice}
            onToggleRecording={setIsRecordingMode}
            isRecordingMode={isRecordingMode}
          />
        </View>
      );
    }

    return (
      <InputToolbar
        {...props}
        renderActions={() => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.plusIconBtn}>
              <Icon name="add-circle" size={36} color="#075E54" />
            </TouchableOpacity>
          </View>
        )}
        renderSend={(sendProps) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setIsRecordingMode(true)} style={{ paddingHorizontal: 8, marginRight: 4 }}>
              <Icon name="mic-outline" size={24} color="#075E54" />
            </TouchableOpacity>
            <Send {...sendProps}>
              <View style={{ marginRight: 8, marginBottom: 5 }}>
                <Icon name="send" size={22} color="#075E54" />
              </View>
            </Send>
          </View>
        )}
      />
    );
  };

  const renderBubble = (props) => {
    const { currentMessage } = props;
    const isCurrentUser = currentMessage.user._id === current_user;

    if (currentMessage.type === 'voice' && currentMessage.audioUrl) {
      return (
        <View style={[styles.bubbleWrapper, { alignSelf: isCurrentUser ? 'flex-end' : 'flex-start' }]}>
          <VoiceMessagePlayer
            isCurrentUser={isCurrentUser}
            audioUrl={currentMessage.audioUrl}
            durationMs={currentMessage.durationMs}
            isRead={currentMessage.isRead}
            isDelivered={currentMessage.isDelivered}
            createdAt={currentMessage.createdAt}
          />
        </View>
      );
    }

    if (currentMessage.type === 'voice' && currentMessage.audioUrl === 'placeholder') {
      return (
        <View style={[styles.bubbleWrapper, { alignSelf: 'flex-end', maxWidth: '75%', paddingVertical: 10, paddingHorizontal: 12 }]}>
          <View style={[styles.rightBubble, styles.voiceBubbleBase, { backgroundColor: '#dcecd4', flexDirection: 'row', alignItems: 'center' }]}>
            <ActivityIndicator size="small" color="#075E54" style={{ marginRight: 8 }} />
            <Text style={{ color: '#075E54' }}>Uploading voice message...</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.bubbleWrapper, { alignSelf: isCurrentUser ? 'flex-end' : 'flex-start' }]}>
        {currentMessage.text && currentMessage.type !== 'voice' && (
          <Bubble
            {...props}
            wrapperStyle={{ right: styles.rightBubble, left: styles.leftBubble }}
            textStyle={{ right: styles.rightText, left: styles.leftText }}
            renderTime={() => null}
          />
        )}
        {(currentMessage.image || currentMessage.imageUrl) && (
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => setFullImageUri(currentMessage.image || currentMessage.imageUrl)}
          >
            <Image
              source={{ uri: currentMessage.image || currentMessage.imageUrl }}
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
                <Text style={[styles.tickText, { color: currentMessage.isRead ? '#34B7F1' : currentMessage.isDelivered ? '#999' : '#aaa' }]}>
                  {currentMessage.isRead ? '✓✓' : currentMessage.isDelivered ? '✓✓' : '✓'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        {currentMessage.type === 'location' && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => currentMessage.locationUrl && Linking.openURL(currentMessage.locationUrl)}
            style={[isCurrentUser ? styles.rightBubble : styles.leftBubble, { paddingVertical: 8 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 72 }}>
              <Icon name="location" size={18} color="#075E54" />
              <Text style={{ marginLeft: 8, color: '#102a43', fontWeight: '600' }}>Location</Text>
            </View>
            <View style={styles.timeTickContainer}>
              <Text style={styles.timeText}>{new Date(currentMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              {isCurrentUser && (
                <Text style={[styles.tickText, { color: currentMessage.isRead ? '#34B7F1' : currentMessage.isDelivered ? '#999' : '#aaa' }]}>
                  {currentMessage.isRead ? '✓✓' : currentMessage.isDelivered ? '✓✓' : '✓'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        {currentMessage.type !== 'contact' && currentMessage.type !== 'voice' && currentMessage.type !== 'location' && (
          <View style={[styles.timeTickContainer, isCurrentUser ? styles.sentContainer : styles.receivedContainer]}>
            <Text style={styles.timeText}>{new Date(currentMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            {isCurrentUser && <Text style={[styles.tickText, { color: currentMessage.isRead ? '#34B7F1' : currentMessage.isDelivered ? '#999' : '#aaa' }]}>{currentMessage.isRead ? '✓✓' : currentMessage.isDelivered ? '✓✓' : '✓'}</Text>}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ECE5DD' }}>
      <FullImageModal />
      <PlusModal />
      <ContactsModal />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() =>
            navigation.navigate('ExpertChatDes', {
              userId: second_user,
              userName: secondUserName,
              userPic: dpImage,
              userPhone: secondUserPhone,
            })
          }
        >
          <Image
            source={{ uri: dpImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{secondUserName || 'User'}</Text>
            <Text style={styles.userPhone}>{secondUserPhone || 'N/A'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Chat Interface */}
      <GiftedChat
        key={chatId}
        messages={messages}
        onSend={onSend}
        user={{ _id: current_user }}
        showAvatarForEveryMessage
        alwaysShowSend={!isRecordingMode}
        scrollToBottom
        renderInputToolbar={renderInputToolbar}
        renderBubble={renderBubble}
        renderActions={() => isRecordingMode ? null : (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.plusIconBtn}>
            <Icon name="add-circle" size={36} color="#075E54" />
          </TouchableOpacity>
        )}
        renderSend={() => null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#075E54', elevation: 4 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  userPhone: { fontSize: 13, color: '#e6e6e6' },
  bubbleWrapper: { position: 'relative', marginBottom: 2 },
  rightBubble: { backgroundColor: '#DCF8C6', borderRadius: 12, borderTopRightRadius: 2, marginRight: 8, marginBottom: 6, paddingRight: 68, paddingVertical: 8, paddingLeft: 10, maxWidth: '92%' },
  leftBubble: { backgroundColor: '#FFFFFF', borderRadius: 12, borderTopLeftRadius: 2, marginLeft: 8, marginBottom: 6, paddingRight: 68, paddingVertical: 8, paddingLeft: 10, maxWidth: '92%' },
  rightText: { color: '#000', fontSize: 15 },
  leftText: { color: '#000', fontSize: 15 },
  contactInlineRow: { flexDirection: 'row', alignItems: 'center' },
  contactInlineIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#e6f3ef', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  contactInlineName: { fontSize: 15, fontWeight: '700', color: '#102a43' },
  contactInlinePhone: { fontSize: 13, color: '#4a5568', marginTop: 1 },
  contactBubble: { paddingRight: 56, paddingTop: 4, paddingBottom: 4, marginBottom: 2 },
  contactDivider: { height: 0, marginTop: 0, marginBottom: 0 },
  timeTickContainer: { position: 'absolute', bottom: 4, right: 12, flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 10, color: '#667781', opacity: 0.9, marginRight: 6 },
  tickText: { fontSize: 11 },
  sentContainer: { right: 12 },
  receivedContainer: { right: 12 },
  plusIconBtn: { paddingHorizontal: 6, paddingVertical: 2 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end', alignItems: 'stretch' },
  plusModalContainer: { width: '100%', backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, alignItems: 'center', elevation: 6, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 18, color: '#222' },
  plusModalOptions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
  plusOptionBtn: { flex: 1, alignItems: 'center', marginHorizontal: 10, paddingVertical: 8 },
  plusOptionText: { fontSize: 13, color: '#075E54', marginTop: 5, fontWeight: '600' },
  modalCancelBtn: { marginTop: 18, paddingVertical: 8, paddingHorizontal: 22, borderRadius: 8, backgroundColor: '#e6f3ef' },
  modalSendBtn: { marginTop: 5, paddingVertical: 8, paddingHorizontal: 22, borderRadius: 8, backgroundColor: '#075E54', alignSelf: 'flex-end' },
  searchInput: { alignSelf: 'stretch', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8 },
  contactName: { fontSize: 15, fontWeight: '600', color: '#222' },
  contactPhone: { fontSize: 13, color: '#555', marginTop: 2 },
  contactCardName: { fontSize: 15, fontWeight: '700', color: '#000' },
  contactCardPhone: { fontSize: 13, color: '#333', marginTop: 2 },
  contactLeftBubble: { backgroundColor: '#FFFFFF', borderRadius: 12, borderTopLeftRadius: 2, marginLeft: 8, marginBottom: 6, paddingVertical: 8, paddingLeft: 10, paddingRight: 45, maxWidth: '80%', borderWidth: 1, borderColor: '#eee' },
  contactRightBubble: { backgroundColor: '#DCF8C6', borderRadius: 12, borderTopRightRadius: 2, marginRight: 8, marginBottom: 6, paddingVertical: 8, paddingLeft: 10, paddingRight: 45, maxWidth: '80%' },
  contactIconCircle: { width: 28, height: 28, borderRadius: 14, marginRight: 8, backgroundColor: '#e6f3ef', alignItems: 'center', justifyContent: 'center' },
  contactActionsRow: { flexDirection: 'row', marginTop: 8 },
  contactActionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#075E54', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  contactActionText: { color: '#fff', fontSize: 12, fontWeight: '700', marginLeft: 6 },
  closeIconBtn: { padding: 6, borderRadius: 20, backgroundColor: '#e8f3ef' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { marginTop: 8, fontSize: 16, fontWeight: '700', color: '#666' },
  emptySub: { fontSize: 13, color: '#999', marginTop: 2 },
  avatarCircle: { width: 36, height: 36, borderRadius: 18, marginRight: 10, backgroundColor: '#d9efe6', alignItems: 'center', justifyContent: 'center' },
  avatarCircleLarge: { width: 48, height: 48, borderRadius: 24, marginRight: 10, backgroundColor: '#d9efe6', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#075E54', fontWeight: '700' },
  previewRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', paddingVertical: 6, marginBottom: 8 },
  numberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 },
  numberTypeTag: { alignSelf: 'flex-start', backgroundColor: '#eef6f3', color: '#075E54', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, marginTop: 4, overflow: 'hidden' },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#075E54', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#075E54' },
  primaryBtn: { alignSelf: 'stretch', backgroundColor: '#075E54', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  primaryBtnDisabled: { backgroundColor: '#b7d7cd' },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  miniSendBtnGreen: { backgroundColor: '#006644', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  customInputToolbar: {
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    backgroundColor: '#fff',
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceBubbleBase: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    maxWidth: '80%',
    minWidth: 180,
    marginBottom: 6,
  },
  senderVoiceBubble: {
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 2,
    marginRight: 8,
    paddingRight: 45,
  },
  receiverVoiceBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 2,
    marginLeft: 8,
  },
  voiceDurationText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
  voiceProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    borderRadius: 2,
    overflow: 'hidden',
  },
  voiceProgress: {
    height: '100%',
    backgroundColor: '#075E54',
  },
});