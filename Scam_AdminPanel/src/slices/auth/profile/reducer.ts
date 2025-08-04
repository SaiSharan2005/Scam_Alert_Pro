import { createSlice } from "@reduxjs/toolkit";
import { Profiledata } from "./thunk";

interface Profile {
  users: string;
  profile_image_url: string;
}

interface ProfileState {
  user: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Profiledata.pending, (state) => {
        state.loading = true;
      })
      .addCase(Profiledata.fulfilled, (state: any, action: any) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(Profiledata.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch profile data";
        state.loading = false;
      });
  },
});

export default profileSlice.reducer;
