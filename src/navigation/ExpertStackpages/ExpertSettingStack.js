// navigation/SettingsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpertSetting from '../../SettingPages/ExpertSettingspg';
import ExpertMyAcc from '../../SettingPages/ExpertMyaccpg';
import PrivacyPolicy from '../../SettingPages/PrivacyPolicypg';
import Languagepg from '../../SettingPages/LanguageChangepg';
import FeedbackPage from '../../SettingPages/Feedbackpg';

const Stack = createNativeStackNavigator();

export default function ExpertSettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ExpertSetting" component={ExpertSetting} />
      <Stack.Screen name="ExpertMyAcc" component={ExpertMyAcc} />
      <Stack.Screen name="FPrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="FLanguage" component={Languagepg} />
         <Stack.Screen name="FarmerFeedback" component={FeedbackPage} />
    </Stack.Navigator>
  );
}
