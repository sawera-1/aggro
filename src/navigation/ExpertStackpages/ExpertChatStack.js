// navigation/ChatsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ExpertChatDes from '../../Expertspages/ExpertHomeScreens/Chats/ExpertChatMsgDescriptionpg';
import ExpertChat from '../../Expertspages/ExpertHomeScreens/Chats/ExpertChatpg';
import ExpertChatScreen from '../../Expertspages/ExpertHomeScreens/Chats/ExpertChatMsgpg';

const Stack = createNativeStackNavigator();

export default function ExpertChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpertChat" component={ExpertChat} />
      <Stack.Screen name="ExpertChatMsg" component={ExpertChatScreen} />
      <Stack.Screen name="ExpertChatDes" component={ExpertChatDes} />

    </Stack.Navigator>
  );
}
