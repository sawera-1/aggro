import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

export default function ExpertMyAcc({ navigation }) {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../images/background.jpg')}
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
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
            {t('expertMyaccount.myAccount')}
          </Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}>
          {/* Profile Image */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Image
              source={require('../images/a.png')}
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                borderWidth: 3,
                borderColor: '#006644',
              }}
            />
            <TouchableOpacity
              style={{
                marginTop: 10,
                paddingVertical: 10,
                paddingHorizontal: 25,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#006644' }}>
                {t('expertMyaccount.edit')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#006644', marginBottom: 5 }}>
            {t('expertMyaccount.name')}
          </Text>
          <TextInput
            placeholder={t('expertMyaccount.enterName')}
            value={name}
            onChangeText={setName}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 15,
            }}
          />

          {/* Phone */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#006644', marginBottom: 5 }}>
            {t('expertMyaccount.phoneNumber')}
          </Text>
          <TextInput
            placeholder={t('expertMyaccount.enterPhone')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 15,
            }}
          />

          {/* Qualification */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#006644', marginBottom: 5 }}>
            {t('expertMyaccount.qualification')}
          </Text>
          <TextInput
            placeholder={t('expertMyaccount.enterQualification')}
            value={qualification}
            onChangeText={setQualification}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 15,
            }}
          />

          {/* Specialization */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#006644', marginBottom: 5 }}>
            {t('expertMyaccount.specialization')}
          </Text>
          <TextInput
            placeholder={t('expertMyaccount.enterSpecialization')}
            value={specialization}
            onChangeText={setSpecialization}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 15,
            }}
          />

          {/* Experience */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#006644', marginBottom: 5 }}>
            {t('expertMyaccount.experience')}
          </Text>
          <TextInput
            placeholder={t('expertMyaccount.enterExperience')}
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 15,
            }}
          />

          {/* Save Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#006644',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 30,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              {t('expertMyaccount.save')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
