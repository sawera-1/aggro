import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, View, Platform } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./src/redux/Store/index"; 
import FarmerStack from "./src/navigation/FarmerStack";
import ExpertStack from "./src/navigation/ExpertStack";
import IntroStack from "./src/navigation/IntroStack";
import "./src/i18n";

import { useSelector } from "react-redux";

const RootNavigator = () => {
  const role = useSelector((state) => state.home.role);

  switch (role) {
    case "farmer":
      return <FarmerStack />;
    case "expert":
      return <ExpertStack />;
    default:
      return <IntroStack />;
  }
};

export default function App() {
  return (
    <Provider store={store}> 
      <PersistGate loading={null} persistor={persistor}> 
        <StatusBar
          barStyle="light-content"
          backgroundColor="#006644"
          translucent={false}
        />
        {Platform.OS === "android" && (
          <View
            style={{
              height: StatusBar.currentHeight,
              backgroundColor: "#006644",
            }}
          />
        )}

        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
