import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEmergencyMessagesAPI,
  createEmergencyMessageAPI,
  deleteEmergencyMessageAPI, 
} from "helpers/fakebackend_helper";

export const getEmergencyMessages = createAsyncThunk("emergency/getMessages", async () => {
  const res = await getEmergencyMessagesAPI();
  return res;
});

export const createEmergencyMessage = createAsyncThunk(
  "emergency/createMessage",
  async (data: { text: string }) => {
    const res = await createEmergencyMessageAPI(data);
    return res;
  }
);

export const deleteEmergencyMessage = createAsyncThunk(
  "emergency/deleteMessage",
  async (id: number) => {
    const res = await deleteEmergencyMessageAPI(id);
    return res;
  }
);
