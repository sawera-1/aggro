// navigation/SettingsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../SettingPages/Settingspg';
import FarmerMyAcc from '../SettingPages/FarmerMyaccpg';
import PrivacyPolicy from '../SettingPages/PrivacyPolicypg';
import Languagepg from '../SettingPages/LanguageChangepg';
import Feedback from '../SettingPages/Feedbackpg';
import ExpertMyAcc from '../SettingPages/ExpertMyaccpg';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Setting" component={SettingsScreen} />
      <Stack.Screen name="FMyAccount" component={FarmerMyAcc} />
      <Stack.Screen name="ExpertMyAcc" component={ExpertMyAcc} />
      <Stack.Screen name="FPrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="FLanguage" component={Languagepg} />
         <Stack.Screen name="FarmerFeedback" component={Feedback} />
    </Stack.Navigator>
  );
}
