// navigation/ExpertStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExpertSignup from "../Expertspages/ExpertAuthenticationScreens/ExpertSignuppg";
import ExpertLogin from "../Expertspages/ExpertAuthenticationScreens/ExpertLoginpg";
import ExpertOtp from "../Expertspages/ExpertAuthenticationScreens/ExpertOtppg";
import EOtpSuccess from "../Expertspages/ExpertAuthenticationScreens/EOtpSuccesspg";
import EOtpFailure from "../Expertspages/ExpertAuthenticationScreens/EOtpFailurepg";
import ExpertChangePassword from "../Expertspages/ExpertAuthenticationScreens/ForgetPasswordpg";
import ExpertpasswordOtp from "../Expertspages/ExpertAuthenticationScreens/ExpertForgotpasswordotppg";
import ExpertloginSuccess from "../Expertspages/ExpertAuthenticationScreens/ExpertLoginSuccesspg";
import ExpertloginFailure from "../Expertspages/ExpertAuthenticationScreens/ExpertloginFailurepg";
import ExpertBottomTabs from "./ExpertStackpages/ExpertBottomtab";
import ExpertSettingsStack from "./ExpertStackpages/ExpertSettingStack";
import FeedbackPage from "../SettingPages/Feedbackpg";


const Stack = createNativeStackNavigator();

const ExpertStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ExpertSignup" component={ExpertSignup} />
    <Stack.Screen name="ExpertOtp" component={ExpertOtp} />
     <Stack.Screen name="ExpertLogin" component={ExpertLogin} />
    <Stack.Screen name="EOtpSuccess" component={EOtpSuccess} />
    <Stack.Screen name="EOtpFailure" component={EOtpFailure} />
    <Stack.Screen name="ExpertChangePassword" component={ExpertChangePassword} />
    <Stack.Screen name="ExpertpasswordOtp" component={ExpertpasswordOtp} />
    <Stack.Screen name="ExpertloginSuccess" component={ExpertloginSuccess} />
    <Stack.Screen name="ExpertloginFailure" component={ExpertloginFailure} />
    <Stack.Screen name="ExpertBottomTabs" component={ExpertBottomTabs} />
     <Stack.Screen name="ExpertSettingsStack" component={ExpertSettingsStack} />
      <Stack.Screen name="FarmerFeedback" component={FeedbackPage} />
  </Stack.Navigator>
);

export default ExpertStack;
