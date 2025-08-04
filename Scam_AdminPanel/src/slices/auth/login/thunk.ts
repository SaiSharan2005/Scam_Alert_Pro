import { loginadmin } from "helpers/fakebackend_helper";
import { loginError, loginSuccess, logoutSuccess } from "./reducer";
import { ThunkAction } from "redux-thunk";
import { Action, Dispatch } from "redux";
import { RootState } from "slices";
import { getFirebaseBackend } from "helpers/firebase_helper";

interface User {
  email: string;
  password: string;
}

export const loginUser =
  (
    user: User,
    history: any
  ): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      let response: any;
      if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
        response = await loginadmin({
          email: user.email,
          password: user.password,
        });

        localStorage.setItem(
          "authUser",
          JSON.stringify({ token: response.token })
        );
      } else if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        let fireBaseBackend = await getFirebaseBackend();

        response = await fireBaseBackend.loginUser(user.email, user.password);
      }

      if (response) {
        dispatch(loginSuccess(response));
        history("/dashboards-analytics");
      }
    } catch (error) {
      dispatch(loginError(error));
    }
  };

export const logoutUser = () => async (dispatch: Dispatch) => {
  try {
    localStorage.removeItem("authUser");

    let fireBaseBackend = await getFirebaseBackend();

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutSuccess(response));
    } else {
      dispatch(logoutSuccess(true));
    }
  } catch (error) {
    dispatch(loginError(error));
  }
};
