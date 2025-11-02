import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpertChannel from '../../Expertspages/ExpertHomeScreens/Channels/ExpertChannelpg';
import OwnChannelMsgScreen from '../../Expertspages/ExpertHomeScreens/Channels/OwnchannelMsgpg';
import ExpertChannelMsg from '../../Expertspages/ExpertHomeScreens/Channels/ExpertChannelMsgpg';
import ExpertChannelDescription from '../../Expertspages/ExpertHomeScreens/Channels/ExpertChannelDescriptionpg';
import OwnChannelDescription from '../../Expertspages/ExpertHomeScreens/Channels/OwnChannelDescritionpg';
import CreateChannel from '../../Expertspages/ExpertHomeScreens/Channels/AddChannelpg';
import LocationPiker from '../../Expertspages/ExpertHomeScreens/Chats/LocationPikerpg';

const Stack = createNativeStackNavigator();

const ExpertChannelStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpertChannel" component={ExpertChannel} />
      <Stack.Screen name="OwnChannelMsgScreen" component={OwnChannelMsgScreen} />
      <Stack.Screen name="ExpertChannelMsg" component={ExpertChannelMsg} />
      <Stack.Screen name="ExpertChannelDescription" component={ExpertChannelDescription} />
       <Stack.Screen name="OwnChannelDescription" component={OwnChannelDescription} />
       <Stack.Screen name="CreateChannel" component={CreateChannel} />
              <Stack.Screen name="LocationPiker" component={LocationPiker} />
    </Stack.Navigator>
  );
};

export default ExpertChannelStack;
