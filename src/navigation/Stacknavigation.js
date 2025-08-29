// navigation/StackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../Introscreens/Splashscreenpg';
import LanguageScreen from '../Introscreens/Languagepg';
import UserType from '../Introscreens/Usertypepg';
import Farmersignup from '../Farmerpages/FarmerAuthenticationScreens/FarmerSignuppg';
import FarmerOtp from '../Farmerpages/FarmerAuthenticationScreens/FarmerOtppg';
import FarmerLogin from '../Farmerpages/FarmerAuthenticationScreens/Farmerloginpg';
import OtpSuccess from '../Farmerpages/FarmerAuthenticationScreens/OtpSuccesspg';
import OtpFailure from '../Farmerpages/FarmerAuthenticationScreens/OtpFailurepg';
import BottomTabs from './Bottomtab';
import FeedbackPage from '../SettingPages/Feedbackpg';
import SettingsStack from './SettingsStack';
import ExpertSignup from '../Expertspages/ExpertAuthenticationScreens/ExpertSignuppg';
import ExpertOtp from '../Expertspages/ExpertAuthenticationScreens/ExpertOtppg';
import EOtpSuccess from '../Expertspages/ExpertAuthenticationScreens/EOtpSuccesspg';
import EOtpFailure from '../Expertspages/ExpertAuthenticationScreens/EOtpFailurepg';
import ExpertLogin from '../Expertspages/ExpertAuthenticationScreens/ExpertLoginpg';
import ExpertChangePassword from '../Expertspages/ExpertAuthenticationScreens/ForgetPasswordpg';
import ExpertpasswordOtp from '../Expertspages/ExpertAuthenticationScreens/ExpertForgotpasswordotppg';
import ExpertloginFailure from '../Expertspages/ExpertAuthenticationScreens/ExpertloginFailurepg';
import ExpertBottomTabs from './ExpertBottomtab';
import ExpertloginSuccess from '../Expertspages/ExpertAuthenticationScreens/ExpertLoginSuccesspg';





const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/*  Flow  for farmer*/}
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
      <Stack.Screen name="UserType" component={UserType} />
      <Stack.Screen name="Farmersignup" component={Farmersignup} />
      <Stack.Screen name="FarmerOtp" component={FarmerOtp} />
      <Stack.Screen name="FarmerLogin" component={FarmerLogin} />
      <Stack.Screen name="OtpSuccess" component={OtpSuccess} />
      <Stack.Screen name="OtpFailure" component={OtpFailure} />
      <Stack.Screen name="FarmerFeedback" component={FeedbackPage} />
      <Stack.Screen name="SettingStack" component={SettingsStack} />

{/* Flow  expert*/}
      <Stack.Screen name="ExpertSignup" component={ExpertSignup} />
      <Stack.Screen name="ExpertOtp" component={ExpertOtp} />
      <Stack.Screen name="EOtpSuccess" component={EOtpSuccess} />
       <Stack.Screen name="EOtpFailure" component={EOtpFailure} />
       <Stack.Screen name="ExpertLogin" component={ExpertLogin} />
        <Stack.Screen name="ExpertChangePassword" component={ExpertChangePassword} />
        <Stack.Screen name="ExpertpasswordOtp" component={ExpertpasswordOtp} />
        <Stack.Screen name="ExpertloginSuccess" component={ExpertloginSuccess} />
        <Stack.Screen name="ExpertloginFailure" component={ExpertloginFailure} />
      {/* Main App */}
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="ExpertBottomTabs" component={ExpertBottomTabs} />

    </Stack.Navigator>
  );
}
