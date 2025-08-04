import { ThunkAction } from "redux-thunk";
import { RootState } from "slices";
import { Action, Dispatch } from "redux";
import { signupadmin } from "helpers/fakebackend_helper";
import { registerFailed, registerSuccess, resetRegister } from "./reducer";
import { getFirebaseBackend } from "helpers/firebase_helper";

interface User {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone_number: string;
    date_of_birth: string;
    password: string;
}

export const registerUser = (user: User
): ThunkAction<void, RootState, unknown, Action<string>> => async (dispatch: Dispatch) => {
    try {
        let response: any;
        if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
            response = await signupadmin(user);
        } else if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            
            // initialize relevant method of both Auth
            const fireBaseBackend = getFirebaseBackend();

            response = fireBaseBackend.registerUser(user.email, user.password);
        }
        if (response) {
            dispatch(registerSuccess(response));
        }
    } catch (error) {
        dispatch(registerFailed(error));
    }
};

export const resetRegisterFlag = () => {
    try {
        const response = resetRegister(false);
        return response;
    } catch (error) {
        return error;
    }
};