import { createAsyncThunk } from "@reduxjs/toolkit";
import { changePasswordAPI } from "helpers/fakebackend_helper";

export const changePassword = createAsyncThunk(
  "password/changePassword",
  async (
    data: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await changePasswordAPI(data);
      return response;
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.response?.data?.message ||
            error?.message ||
            "Something went wrong";
      return rejectWithValue(message);
    }
  }
);
