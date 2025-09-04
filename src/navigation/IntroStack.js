import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../Introscreens/Splashscreenpg";
import LanguageScreen from "../Introscreens/Languagepg";
import UserType from "../Introscreens/Usertypepg";
import FarmerSignup from "../Farmerpages/FarmerAuthenticationScreens/FarmerSignuppg";
import ExpertSignup from "../Expertspages/ExpertAuthenticationScreens/ExpertSignuppg";

const Stack = createNativeStackNavigator();

export default function IntroStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="UserType" component={UserType} />
      <Stack.Screen name="FarmerSignup" component={FarmerSignup} />
      <Stack.Screen name="ExpertSignup" component={ExpertSignup} />
    </Stack.Navigator>
  );
}
