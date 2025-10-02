import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  user: null,         // Firebase user object
  role: "",           // "farmer" or "expert"
  loading: false,     
  confirmation: null, // Firebase OTP confirmation object
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setConfirmation: (state, action) => {
      state.confirmation = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.role = "";
      state.confirmation = null;
    },
  },
});

export const { setUser, setRole, setLoading, setConfirmation, logoutUser } =
  homeSlice.actions;

export default homeSlice.reducer;
