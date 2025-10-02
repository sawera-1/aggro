// navigation/ExpertStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ExpertBottomTabs from "./ExpertStackpages/ExpertBottomtab";
import ExpertSettingsStack from "./ExpertStackpages/ExpertSettingStack";
import FeedbackPage from "../SettingPages/Feedbackpg";
import ExpertSignup from "../Expertspages/ExpertAuthenticationScreens/ExpertSignuppg";
import ExpertSignupOtp from "../Expertspages/ExpertAuthenticationScreens/ExpertOtppg";
import ExpertLogin from "../Expertspages/ExpertAuthenticationScreens/ExpertLoginpg";
import ExpertLoginOtp from "../Expertspages/ExpertAuthenticationScreens/ExpertOtploginpg";
import ExpertOtpSuccess from "../Expertspages/ExpertAuthenticationScreens/ExpertOtpSuccesspg";
import ExpertOtpFailure from "../Expertspages/ExpertAuthenticationScreens/ExpertOtpFailurepg";


const Stack = createNativeStackNavigator();

const ExpertStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ExpertSignup" component={ExpertSignup} />
    <Stack.Screen name="ExpertOtp" component={ExpertSignupOtp} />
    <Stack.Screen name="ExpertloginOtp" component={ExpertLoginOtp} />
     <Stack.Screen name="ExpertLogin" component={ExpertLogin} />
    <Stack.Screen name="ExpertOtpSuccess" component={ExpertOtpSuccess} />
    <Stack.Screen name="ExpertOtpFailure" component={ExpertOtpFailure} />
    <Stack.Screen name="ExpertBottomTabs" component={ExpertBottomTabs} />
     <Stack.Screen name="ExpertSettingsStack" component={ExpertSettingsStack} />
      <Stack.Screen name="FarmerFeedback" component={FeedbackPage} />
  </Stack.Navigator>
);

export default ExpertStack;
