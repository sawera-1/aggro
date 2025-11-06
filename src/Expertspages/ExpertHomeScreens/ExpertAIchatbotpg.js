import React from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity , SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const ExpertAIChatbot= ({ navigation }) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e9e9e1' }}>
      
      {/* Top Bar */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#006644',
        paddingVertical: 10,
        paddingHorizontal: 15,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image 
          source={require('../../images/ai.png')}
          style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10 }} 
        />
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>
          {t('expertAi.title')}
        </Text>
      </View>

      {/* Messages */}
      <ScrollView contentContainerStyle={{ padding: 10, flexGrow: 1 }}>
        {/* AI Message */}
        <View style={{
          backgroundColor: '#DCF8C6',
          alignSelf: 'flex-start',
          padding: 12,
          borderRadius: 15,
          marginVertical: 5,
          maxWidth: '75%',
          borderBottomLeftRadius: 0,
        }}>
          <Text style={{ fontSize: 16 }}>
            Hello! How can I help you?
          </Text>
        </View>

        {/* User Message */}
        <View style={{
          backgroundColor: '#fff',
          alignSelf: 'flex-end',
          padding: 12,
          borderRadius: 15,
          marginVertical: 5,
          maxWidth: '75%',
          borderBottomRightRadius: 0,
        }}>
          <Text style={{ fontSize: 16 }}>
            I want to know about wheat farming.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={{
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#006644',
      }}>
        {/* Camera / Gallery */}
        <TouchableOpacity style={{ marginRight: 5 }}>
          <Icon name="photo-camera" size={28} color="#031501ff" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 5 }}>
          <Icon name="image" size={28} color="#031501ff" />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          placeholder={t('expertAi.typeMessage')}
          style={{
            flex: 1,
            height: 45,
            borderWidth: 1,
            borderColor: '#006644',
            backgroundColor:"#e9e9e1",
            borderRadius: 25,
            paddingHorizontal: 15,
            fontSize: 16,
          }}
        />

        {/* Voice */}
        <TouchableOpacity style={{ marginLeft: 5 }}>
          <Icon name="keyboard-voice" size={28} color="#031501ff" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default ExpertAIChatbot;