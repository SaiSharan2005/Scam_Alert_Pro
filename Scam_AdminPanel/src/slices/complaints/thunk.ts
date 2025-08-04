// src/slices/complaints/thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyComplaintsAPI,
  createComplaintAPI,
  updateComplaintAPI,
  deleteComplaintAPI,
} from "helpers/fakebackend_helper";

// GET complaints
export const getMyComplaints = createAsyncThunk("complaints/getMyComplaints", async () => {
  const response = await getMyComplaintsAPI();
  return response;
});

// CREATE complaint
export const createComplaint = createAsyncThunk(
  "complaints/createComplaint",
  async (formData: FormData) => {
    const response = await createComplaintAPI(formData);
    return response;
  }
);

// UPDATE complaint
export const updateComplaint = createAsyncThunk(
  "complaints/updateComplaint",
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await updateComplaintAPI(id, formData);
    return response;
  }
);

// DELETE complaint
export const deleteComplaint = createAsyncThunk(
  "complaints/deleteComplaint",
  async (id: number) => {
    const response = await deleteComplaintAPI(id);
    return response;
  }
);
