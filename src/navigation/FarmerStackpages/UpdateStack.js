// navigation/UpdatesStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UpdateScreen from '../../Farmerpages/FarmerHomeScreens/Update/FarmerUpdatepg';
import GovtReadMore from '../../Farmerpages/FarmerHomeScreens/Update/GovtSchReadmorepg';
import PriceReadMore from '../../Farmerpages/FarmerHomeScreens/Update/MpriceReadmore';
import CropReadMore from '../../Farmerpages/FarmerHomeScreens/Update/CropInfoReadmore';


const Stack = createNativeStackNavigator();

export default function UpdatesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UpdateScreen" component={UpdateScreen} />
      <Stack.Screen name="GovtRead" component={GovtReadMore} />
      <Stack.Screen name="PriceRead" component={PriceReadMore} />
      <Stack.Screen name="CropRead" component={CropReadMore} />
    </Stack.Navigator>
  );
}
