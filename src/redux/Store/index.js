import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import HomeDataSlice from "../Slices/HomeDataSlice.js";
// ✅ Persist config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["home"], // Only persist home slice
};

// ✅ Combine reducers
const rootReducer = combineReducers({
  home: HomeDataSlice,
});

// ✅ Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

// ✅ Create persistor
const persistor = persistStore(store);

export { store, persistor };
