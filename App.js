import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";   
import StackNavigator from "./src/navigation/Stacknavigation";

import "./src/i18n";

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>   
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
