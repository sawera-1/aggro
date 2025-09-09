import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,          // Firebase user object
  role: "",            // "farmer" or "expert"
  loading: false,
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
    logoutUser: (state) => {
      state.user = null;
      state.role = "";
    },
  },
});

export const { setUser, setRole, setLoading, logoutUser } = homeSlice.actions;
export default homeSlice.reducer;
