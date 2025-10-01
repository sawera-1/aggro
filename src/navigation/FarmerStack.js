import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import OtpSuccess from "../Farmerpages/FarmerAuthenticationScreens/OtpSuccesspg";
import OtpFailure from "../Farmerpages/FarmerAuthenticationScreens/OtpFailurepg";
import FeedbackPage from "../SettingPages/Feedbackpg";
import SettingsStack from "./FarmerStackpages/SettingsStack";
import BottomTabs from "./FarmerStackpages/Bottomtab";
import FarmerLogin from "../Farmerpages/FarmerAuthenticationScreens/Farmerloginpg";
import FarmerOtp from "../Farmerpages/FarmerAuthenticationScreens/FarmerOtppg";
import FarmerSignup from "../Farmerpages/FarmerAuthenticationScreens/FarmerSignuppg";

const Stack = createNativeStackNavigator();


const FarmerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FarmerSignup" component={FarmerSignup} />
    <Stack.Screen name="FarmerOtp" component={FarmerOtp} />
    <Stack.Screen name="FarmerLogin" component={FarmerLogin} />
    <Stack.Screen name="OtpSuccess" component={OtpSuccess} />
    <Stack.Screen name="OtpFailure" component={OtpFailure} />
    <Stack.Screen name="SettingStack" component={SettingsStack} />
    <Stack.Screen name="BottomTabs" component={BottomTabs} />
    <Stack.Screen name="FarmerFeedback" component={FeedbackPage} />
  </Stack.Navigator>
);

export default FarmerStack;
