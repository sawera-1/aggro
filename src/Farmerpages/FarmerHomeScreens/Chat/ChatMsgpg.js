import React, { useState } from 'react';
import {  View, Text, TouchableOpacity, Image, TextInput, ScrollView, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';  
import { SafeAreaView } from "react-native-safe-area-context";
const ChatMsgScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const route = useRoute();
  const { t } = useTranslation();  
 
  const { name, image, phone } = route.params || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e9e9e1' }}>
      
      {/* Top Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#006644', paddingVertical: 10, paddingHorizontal: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ChatDes', {
              chatName: name,
              chatImage: image,
              chatPhone: phone
            })
          }
        >
          <Image
            source={image || require('../../../images/chdummyimg.png')}
            style={{ width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 }}
          />
        </TouchableOpacity>

        <Text style={{ color: '#fff', fontSize: 18, flex: 1 }}>{name || t('chatMsg.unknown')}</Text>
      </View>

      {/* Chat Body */}
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <View style={{ backgroundColor: '#DCF8C6', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 10 }}>
          <Text>Hello! This is a test message.</Text>
        </View>
        <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, alignSelf: 'flex-end', marginBottom: 10 }}>
          <Text>Hi! This is a reply.</Text>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, backgroundColor: '#006644', borderTopWidth: 1, borderColor: '#006644' }}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Entypo name="plus" size={24} color="#031501ff" style={{ marginHorizontal: 5 }} />
        </TouchableOpacity>

        <TextInput
          placeholder={t('chatMsg.typeMessage')}
          style={{ flex: 1, backgroundColor: '#e9e9e1', borderRadius: 20, paddingHorizontal: 15, marginHorizontal: 5 }}
        />

        <TouchableOpacity>
          <Ionicons name="camera" size={24} color="#031501ff" style={{ marginHorizontal: 5 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="microphone" size={24} color="#031501ff" style={{ marginHorizontal: 5 }} />
        </TouchableOpacity>
      </View>

      {/* Popup Menu */}
      <Modal transparent animationType="fade" visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPressOut={() => setMenuVisible(false)}>
          <View style={{ position: 'absolute', bottom: 60, left: 10, backgroundColor: '#e9e9e9', borderRadius: 10, padding: 10, elevation: 5 }}>
            <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 8 }}>
              <Ionicons name="camera" size={20} color="#031501ff" />
            <Text style={{ marginLeft: 10 }}>{t('chatMsg.camera')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 8 }}>
              <MaterialIcons name="insert-drive-file" size={20} color="#031501ff" />
           <Text style={{ marginLeft: 10 }}>{t('chatMsg.documents')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 8 }}>
              <Ionicons name="location" size={20} color="#031501ff" />
              <Text style={{ marginLeft: 10 }}>{t('chatMsg.location')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 8 }}>
              <Ionicons name="images" size={20} color="#031501ff" />
               <Text style={{ marginLeft: 10 }}>{t('chatMsg.photos')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 8 }}>
              <Ionicons name="person" size={20} color="#031501ff" />
               <Text style={{ marginLeft: 10 }}>{t('chatMsg.contact')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

export default ChatMsgScreen;
