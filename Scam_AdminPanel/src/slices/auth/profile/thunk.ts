import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfile } from "helpers/fakebackend_helper";

export const Profiledata = createAsyncThunk(
  "profile/profiledata",
  async () => {
    const res = await getProfile();
    return res;
  }
);
