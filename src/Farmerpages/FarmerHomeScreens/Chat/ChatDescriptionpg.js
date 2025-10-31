import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ChatDescription() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params || {}; 
  const currentUserId = auth().currentUser?.uid;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


  //  Fetch user info
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(
        docSnap => {
          if (docSnap.exists) setUserData(docSnap.data());
          else setUserData(null);
          setLoading(false);
        },
        error => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [userId]);

 

  //  Navigate to report page
  const handleReportUser = () => {
    navigation.navigate('FarmerFeedback', { reportedUserId: userId });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#006644" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>User not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/*  Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: '#006644',
          elevation: 5,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Image
          source={
            userData.dpImage
              ? { uri: userData.dpImage }
              : require('../../../images/chdummyimg.png')
          }
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            marginRight: 12,
            borderWidth: 1,
            borderColor: '#fff',
          }}
        />

        <Text
          style={{
            color: '#fff',
            fontSize: 19,
            fontWeight: 'bold',
            flexShrink: 1,
          }}
        >
          {userData.name || 'Unknown User'}
        </Text>
      </View>

      {/*  Scrollable Info */}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          alignItems: 'center',
          flexGrow: 1,
        }}
      >
        {/* Profile DP */}
        <Image
          source={
            userData.dpImage
              ? { uri: userData.dpImage }
              : require('../../../images/chdummyimg.png')
          }
          style={{
            width: 130,
            height: 130,
            borderRadius: 65,
            borderWidth: 2.5,
            borderColor: '#006644',
            marginBottom: 15,
          }}
        />

        {/* Name */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#006644',
            marginBottom: 6,
          }}
        >
          {userData.name || 'N/A'}
        </Text>

        {/* Phone */}
        <Text style={{ fontSize: 15, color: '#444', marginBottom: 18 }}>
          Phone: {userData.phoneNumber || 'N/A'}
        </Text>

        {/* Qualification */}
        <Text style={{ fontSize: 16, color: '#333', marginBottom: 6 }}>
          🎓 {userData.qualification || 'N/A'}
        </Text>

        {/* Specialization */}
        <Text style={{ fontSize: 16, color: '#333', marginBottom: 6 }}>
          🌾 {userData.specialization || 'N/A'}
        </Text>

        {/* Experience */}
        <Text style={{ fontSize: 16, color: '#333', marginBottom: 18 }}>
          ⏱️ {userData.experience || '0'} years experience
        </Text>

       
        {/* Report Button */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ff9900',
            paddingVertical: 15,
            paddingHorizontal: 22,
            borderRadius: 14,
            width: '90%',
            elevation: 4,
          }}
          onPress={handleReportUser}
        >
          <Ionicons name="alert-circle" size={22} color="#fff" style={{ marginRight: 10 }} />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Report User</Text>
        </TouchableOpacity>
      </ScrollView>

      
    </SafeAreaView>
  );
}
