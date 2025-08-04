import React, { useState, useEffect } from "react";
import BreadCrumb from "Common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { changePassword } from "slices/auth/changepassword/thunk";
import { createSelector } from "reselect";

const ChangePassword = () => {
  const dispatch = useDispatch<any>();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const selectChange = createSelector(
    (state: any) => state.ChangePassword,
    (changePassword) => ({
      loading: changePassword.loading,
      successMessage: changePassword.successMessage,
      errorMessage: changePassword.errorMessage,
    })
  );

  const { loading, successMessage, errorMessage } = useSelector(selectChange);

  useEffect(() => {
    if (typeof successMessage === "string") toast.success(successMessage);
    if (typeof errorMessage === "string") toast.error(errorMessage);
  }, [successMessage, errorMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    await dispatch(changePassword(form));
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <React.Fragment>
      <BreadCrumb title="Change Password" pageTitle='Dashboards' />
      <ToastContainer closeButton={false} limit={1} />

      <div className="card max-w-xl mx-auto">
        <div className="card-body space-y-4">
          <h5 className="text-15">Update Your Password</h5>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              name="oldPassword"
              placeholder="Current Password"
              value={form.oldPassword}
              onChange={handleChange}
              className="form-input w-full border dark:bg-zink-700 dark:border-zink-500 dark:text-white"
              required
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="form-input w-full border dark:bg-zink-700 dark:border-zink-500 dark:text-white"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="form-input w-full border dark:bg-zink-700 dark:border-zink-500 dark:text-white"
              required
            />

            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded text-sm"
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChangePassword;
