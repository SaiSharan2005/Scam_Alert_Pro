import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getUserList as getUserListApi,
} from "../../helpers/fakebackend_helper";
import 'react-toastify/dist/ReactToastify.css';

export const getUserList = createAsyncThunk("users/getUserList", async () => {
    try {
        const response = getUserListApi();
        return response;
    } catch (error) {
        return error;
    }
});

