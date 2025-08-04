import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardCountsAPI } from "helpers/fakebackend_helper";

export const getDashboard = createAsyncThunk(
  "dashboard/getDashboardata",
  async () => {
    const res = await getDashboardCountsAPI();
    return res;
  }
);
