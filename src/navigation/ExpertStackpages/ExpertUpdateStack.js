// navigation/UpdatesStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpertUpdate from '../../Expertspages/ExpertHomeScreens/Updates/ExpertUpdatepg';
import ExpertGovtReadMore from '../../Expertspages/ExpertHomeScreens/Updates/ExpertGovSchReadMorepg';
import ExpertCropReadMore from '../../Expertspages/ExpertHomeScreens/Updates/ExpertCropInfoReadMorepg';


const Stack = createNativeStackNavigator();

export default function ExpertUpdateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpertUpdate" component={ExpertUpdate} />
      <Stack.Screen name="ExpertGovtReadMore" component={ExpertGovtReadMore} />
      <Stack.Screen name="ExpertCropReadMore" component={ExpertCropReadMore} />
    </Stack.Navigator>
  );
}
