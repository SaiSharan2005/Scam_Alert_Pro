import { createSlice } from "@reduxjs/toolkit";
import { changePassword } from "./thunk";

interface ChangePasswordState {
  successMessage: string | null;
  errorMessage: string | null;
  loading: boolean;
}

const initialState: ChangePasswordState = {
  successMessage: null,
  errorMessage: null,
  loading: false,
};

const changePasswordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(changePassword.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Password changed!";
      })
      .addCase(changePassword.rejected, (state, action:any) => {
        state.loading = false;
        state.errorMessage =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to change password";
      });
  },
});

export default changePasswordSlice.reducer;
