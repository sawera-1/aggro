import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const OwnChannelDescription = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { channelName, channelImage, channelDescription } = route.params;

  const [name, setName] = useState(channelName);
  const [description, setDescription] = useState(channelDescription);
  const [members, setMembers] = useState(120);

  return (
   <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../images/background.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.9 }}
      >
        {/* Top Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 12,
            backgroundColor: '#006644',
            elevation: 5,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          {/* Circular Image */}
          <Image
            source={channelImage || require('../../../images/chdummyimg.png')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 10,
            }}
          />

          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              flexShrink: 1,
            }}
          >
            {name}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Circular Channel Image */}
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Image
              source={channelImage || require('../../../images/chdummyimg.png')}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 3,
                borderColor: '#006644',
              }}
            />
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color:'#006644', fontSize:18 }}>{t('ownchannelDes.edit')}</Text>
            </TouchableOpacity>
          </View>

          {/* Edit Form */}
          <View
            style={{
              padding: 20,
              backgroundColor: '#fff',
              borderRadius: 12,
              marginHorizontal: 15,
              elevation: 2,
            }}
          >
            {/* Name */}
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('ownchannelDes.channelName')}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 12,
                marginBottom: 15,
                fontSize: 16,
              }}
            />

            {/* Description */}
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={t('ownchannelDes.channelDescription')}
              multiline
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 12,
                height: 100,
                textAlignVertical: 'top',
                fontSize: 16,
                marginBottom: 15,
              }}
            />

            {/* Total Members */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {t('ownchannelDes.totalMembers')}: {members}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('contactpg')}
                style={{ backgroundColor: '#00aaff', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('ownchannelDes.addMember')}</Text>
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#006644',
                  padding: 14,
                  borderRadius: 12,
                  marginRight: 5,
                  alignItems: 'center',
                  elevation: 2,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{t('ownchannelDes.saveChanges')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OwnChannelDescription;
