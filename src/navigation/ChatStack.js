// navigation/ChatsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatDescription from '../Farmerpages/FarmerHomeScreens/Chat/ChatDescriptionpg';
import ChatScreen from '../Farmerpages/FarmerHomeScreens/Chat/FarmerChatpg';
import ChatMsgScreen from '../Farmerpages/FarmerHomeScreens/Chat/ChatMsgpg';


const Stack = createNativeStackNavigator();

export default function ChatsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ChatMsg" component={ChatMsgScreen} />
      <Stack.Screen name="ChatDes" component={ChatDescription} />

    </Stack.Navigator>
  );
}
