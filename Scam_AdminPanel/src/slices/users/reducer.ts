import { createSlice } from "@reduxjs/toolkit";
import {
    getUserList,
} from './thunk';

export const initialState = {
    userList: [],
    userGrid: [],
    errors: {}
};

const UsersSlice = createSlice({
    name: 'Users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // List
        builder.addCase(getUserList.fulfilled, (state: any, action: any) => {
            state.userList = action.payload;
        });
        builder.addCase(getUserList.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });

    }
});

export default UsersSlice.reducer;