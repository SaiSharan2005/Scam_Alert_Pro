import { createSlice } from "@reduxjs/toolkit";
import {
  getEmergencyMessages,
  createEmergencyMessage,
  deleteEmergencyMessage,
} from "./thunk";

interface EmergencyMessage {
  id: number;
  text: string;
  created_at: string;
}

interface EmergencyState {
  list: EmergencyMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: EmergencyState = {
  list: [],
  loading: false,
  error: null,
};

const emergencySlice = createSlice({
  name: "emergency",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmergencyMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmergencyMessages.fulfilled, (state: any, action: any) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(getEmergencyMessages.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch messages";
        state.loading = false;
      })
      .addCase(createEmergencyMessage.fulfilled, (state) => {})

      .addCase(deleteEmergencyMessage.fulfilled, (state, action) => {
        state.list = state.list.filter((msg) => msg.id !== action.meta.arg);
      });
  },
});

export default emergencySlice.reducer;
