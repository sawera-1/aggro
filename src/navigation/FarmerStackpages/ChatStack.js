// navigation/ChatsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatHomeScreen from '../../Farmerpages/FarmerHomeScreens/Chat/FarmerChatpg';
import ChatScreen from '../../Farmerpages/FarmerHomeScreens/Chat/ChatMsgpg';
import ChatDescription from '../../Farmerpages/FarmerHomeScreens/Chat/ChatDescriptionpg';

const Stack = createNativeStackNavigator();

export default function ChatsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatHome" component={ChatHomeScreen} />
      <Stack.Screen
        name="ChatMsg"
        component={ChatScreen}
        options={{ unmountOnBlur: true }} // prevents duplicate views
      />
      <Stack.Screen name="ChatDes" component={ChatDescription} />
    </Stack.Navigator>
  );
}
