import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';


const SplashScreen = ({ navigation }) => {
 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#006644' }}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        {/* Title */}
        <Text style={{ fontSize: 50, fontWeight: 'bold', alignSelf: 'center' }}>
          <Text style={{ color: '#ffffff' }}>Aggro</Text>
          <Text style={{ color: '#90ee90' }}>Assistant</Text>
        </Text>


        {/* Get Started Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Language')}
          style={{
            marginTop: 30,
            padding: 12,
            borderWidth: 2,
            borderColor: '#ffffff',
            borderRadius: 8  ,
            minWidth: 150,
            alignItems:'center',
            justifyContent:'center'
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
            Get Started
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SplashScreen;
