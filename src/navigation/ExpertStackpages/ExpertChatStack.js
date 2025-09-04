// navigation/ChatsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpertChat from '../../Expertspages/ExpertHomeScreens/Chats/ExpertChatpg';
import ExpertChatMsg from '../../Expertspages/ExpertHomeScreens/Chats/ExpertChatMsgpg';
import ExpertChatDes from '../../Expertspages/ExpertHomeScreens/Chats/ExpertChatMsgDescriptionpg';

const Stack = createNativeStackNavigator();

export default function ExpertChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpertChat" component={ExpertChat} />
      <Stack.Screen name="ExpertChatMsg" component={ExpertChatMsg} />
      <Stack.Screen name="ExpertChatDes" component={ExpertChatDes} />

    </Stack.Navigator>
  );
}
