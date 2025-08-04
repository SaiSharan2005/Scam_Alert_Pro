import { createSlice } from "@reduxjs/toolkit";
import {
  getMyComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from "./thunk";

interface FileData {
  file_url: string;
  file_type: string;
}

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  profile_image_url: string;
}

interface Complaint {
  id: number;
  text_content: string;
  created_at: string;
  user: UserData;
  files: FileData[];
}

interface ComplaintsState {
  list: Complaint[];
  loading: boolean;
  error: string | null;
}

const initialState: ComplaintsState = {
  list: [],
  loading: false,
  error: null,
};

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyComplaints.fulfilled, (state: any, action: any) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(getMyComplaints.rejected, (state: any, action: any) => {
        state.error = action.error.message || "Failed to load complaints";
        state.loading = false;
      })
      .addCase(createComplaint.fulfilled, (state) => {
      })
      .addCase(updateComplaint.fulfilled, () => {
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.meta.arg);
      });
  },
});

export default complaintsSlice.reducer;
