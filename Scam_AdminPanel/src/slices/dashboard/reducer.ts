import { createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "./thunk";

interface Dashboard {
  users: any;
  complaints: string;
}

interface DashboardState {
  list: Dashboard[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  list: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboard.fulfilled, (state: any, action: any) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch messages";
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;
