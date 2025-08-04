import React from "react";
import AuthIcon from "pages/AuthenticationInner/AuthIcon";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetRegisterFlag } from "slices/thunk";
import { createSelector } from "reselect";
import { Link, useNavigate } from "react-router-dom";

// Formik validation
import * as Yup from "yup";
import { useFormik as useFormic } from "formik";

// Image
import logoDark from "assets/images/logo-dark.png";
import logoLight from "assets/images/logo-light.png";
import { RootState } from "slices";

const Register = () => {
  document.title = "Register | Scam Alert Pro";

  const dispatch = useDispatch<any>();
  const navigation = useNavigate(); // Use the useNavigate hook

  const selectRegister = createSelector(
    (state: RootState) => state.Register,
    (register) => ({
      success: register.success,
    })
  );

  const { success } = useSelector(selectRegister);

  const validation: any = useFormic({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      phone_number: "",
      date_of_birth: "",
      password: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please Enter Your First Name"),
      last_name: Yup.string().required("Please Enter Your Last Name"),
      email: Yup.string().email().required("Please Enter Your Email"),
      username: Yup.string().required("Please Enter Your Username"),
      phone_number: Yup.string().required("Please Enter Your Number"),
      date_of_birth: Yup.string().required("Please Enter Date Of Birth"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values: any) => {
      dispatch(registerUser(values));
    },
  });

  React.useEffect(() => {
    if (success) {
      navigation("/login");
    }

    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);
  }, [dispatch, success, navigation]);

  React.useEffect(() => {
    const bodyElement = document.body;

    bodyElement.classList.add(
      "flex",
      "items-center",
      "justify-center",
      "min-h-screen",
      "py-16",
      "lg:py-10",
      "bg-slate-50",
      "dark:bg-zink-800",
      "dark:text-zink-100",
      "font-public"
    );

    return () => {
      bodyElement.classList.remove(
        "flex",
        "items-center",
        "justify-center",
        "min-h-screen",
        "py-16",
        "lg:py-10",
        "bg-slate-50",
        "dark:bg-zink-800",
        "dark:text-zink-100",
        "font-public"
      );
    };
  }, []);

  return (
    <React.Fragment>
      <div className="relative">
        <AuthIcon />

        <div className="mb-0 w-screen lg:w-[500px] card shadow-lg border-none shadow-slate-100 relative">
          <div className="!px-10 !py-12 card-body">
            <Link to="/">
              <img
                src={logoLight}
                alt=""
                className="hidden h-12 mx-auto dark:block"
              />
              <img
                src={logoDark}
                alt=""
                className="block h-12 mx-auto dark:hidden"
              />
            </Link>

            <div className="mt-8 text-center">
              <h4 className="mb-1 text-custom-500 dark:text-custom-500">
                Create your free account
              </h4>
            </div>

            <form
              action="/"
              className="mt-10"
              id="registerForm"
              onSubmit={(event: any) => {
                event.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <div className="mb-3">
                <label
                  htmlFor="first_name-field"
                  className="inline-block mb-2 text-base font-medium"
                >
                  UserName
                </label>
                <input
                  type="text"
                  id="first_name-field"
                  name="first_name"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter First Name"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.first_name || ""}
                />
                {validation.touched.first_name &&
                validation.errors.first_name ? (
                  <div
                    id="first_name-error"
                    className="mt-1 text-sm text-red-500"
                  >
                    {validation.errors.first_name}
                  </div>
                ) : null}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="last_name-field"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name-field"
                  name="last_name"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter Last Name"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.last_name || ""}
                />
                {validation.touched.last_name && validation.errors.last_name ? (
                  <div
                    id="last_name-error"
                    className="mt-1 text-sm text-red-500"
                  >
                    {validation.errors.last_name}
                  </div>
                ) : null}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="email-field"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email-field"
                  name="email"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter email"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.email || ""}
                />
                {validation.touched.email && validation.errors.email ? (
                  <div id="email-error" className="mt-1 text-sm text-red-500">
                    {validation.errors.email}
                  </div>
                ) : null}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="username-field"
                  className="inline-block mb-2 text-base font-medium"
                >
                  UserName
                </label>
                <input
                  type="text"
                  id="username-field"
                  name="username"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter username"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.username || ""}
                />
                {validation.touched.username && validation.errors.username ? (
                  <div
                    id="username-error"
                    className="mt-1 text-sm text-red-500"
                  >
                    {validation.errors.username}
                  </div>
                ) : null}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="Number-field"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="Number-field"
                  maxLength={10}
                  name="phone_number"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter Mobile Number"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.phone_number || ""}
                />
                {validation.touched.phone_number &&
                validation.errors.phone_number ? (
                  <div
                    id="phone_number-error"
                    className="mt-1 text-sm text-red-500"
                  >
                    {validation.errors.phone_number}
                  </div>
                ) : null}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="date_of_birth"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter Date of Birth"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.date_of_birth || ""}
                />
                {validation.touched.date_of_birth &&
                validation.errors.date_of_birth ? (
                  <div
                    id="date_of_birth-error"
                    className="mt-1 text-sm text-red-500"
                  >
                    {validation.errors.date_of_birth}
                  </div>
                ) : null}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter password"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.password || ""}
                />
                {validation.touched.password && validation.errors.password ? (
                  <div
                    id="password-error"
                    className="mt-1 text-sm text-red-500"
                  >
                    {validation.errors.password}
                  </div>
                ) : null}
              </div>
              <p className="italic text-15 text-slate-500 dark:text-zink-200">
                By registering you agree to the Scam Alert Pro{" "}
                <a href="#!" className="underline">
                  Terms of Use
                </a>
              </p>
              <div className="mt-10">
                <button
                  type="submit"
                  className="w-full text-white transition-all duration-200 ease-linear btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                >
                  Sign In
                </button>
              </div>

              <div className="mt-10 text-center">
                <p className="mb-0 text-slate-500 dark:text-zink-200">
                  Already have an account ?{" "}
                  <Link
                    to="/login"
                    className="font-semibold underline transition-all duration-150 ease-linear text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500"
                  >
                    Login
                  </Link>{" "}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Register;
