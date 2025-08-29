import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChannelsScreen from '../Farmerpages/FarmerHomeScreens/Channel/FarmerChannelpg';
import ChannelMsgScreen from '../Farmerpages/FarmerHomeScreens/Channel/ChannelMsgpg';
import ChannelDescription from '../Farmerpages/FarmerHomeScreens/Channel/ChannelDescriptionpg';


const Stack = createNativeStackNavigator();

const ChannelStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Channels" component={ChannelsScreen} />
      <Stack.Screen name="ChannelMsg" component={ChannelMsgScreen} />
      <Stack.Screen name="ChannelDes" component={ChannelDescription} />
    </Stack.Navigator>
  );
};

export default ChannelStack;
