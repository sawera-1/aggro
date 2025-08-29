import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

export default function GovtReadMore({ navigation }) {
  const { t } = useTranslation();


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Background Image */}
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
            backgroundColor: '#006644',
            paddingVertical: 12,
            paddingHorizontal: 15,
            elevation: 4
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            {t('govtReadMore.title')}
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={{ padding: 15, flexGrow: 1 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 15,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3
            }}
          >
            {/* Image */}
            <Image
              source={require('../../../images/govt.png')}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 8,
                resizeMode: 'cover',
                marginBottom: 15
              }}
            />

            {/* Name */}
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: '#006644',
                marginBottom: 6
              }}
            >
              {t('govtReadMore.schemeName')}
            </Text>

            {/* Description */}
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: '#555',
                marginBottom: 12
              }}
            >
              {t('govtReadMore.description')}
            </Text>

            {/* Dates */}
            <Text style={{ fontSize: 14, marginBottom: 4, color: '#333' }}>
              <Text style={{ fontWeight: 'bold' }}>{t('govtReadMore.startDate')}:</Text> 01-Jan-2020
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 4, color: '#333' }}>
              <Text style={{ fontWeight: 'bold' }}>{t('govtReadMore.endDate')}:</Text> 31-Dec-2030
            </Text>

            {/* Buttons Row */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
                justifyContent: 'space-between'
              }}
            >
              {/* Read More */}
              <TouchableOpacity
               
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#006644',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 8
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                  {t('govtReadMore.readMore')}
                </Text>
              </TouchableOpacity>

              {/* Speaker */}
              <TouchableOpacity
              
                style={{
                  backgroundColor: '#006644',
                  padding: 10,
                  borderRadius: 50
                }}
              >
                <Icon name="volume-high" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
