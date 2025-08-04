import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { ToastContainer, toast } from "react-toastify";
import BreadCrumb from "Common/BreadCrumb";
import {
  getEmergencyMessages,
  createEmergencyMessage,
  deleteEmergencyMessage,
} from "slices/emergencynoti/thunk";
import { RefreshCcw, Trash2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const EmergencyMessages = () => {
  const dispatch = useDispatch<any>();
  const [text, setText] = useState("");

  const selectEmergency = createSelector(
    (state: any) => state.Emergency,
    (emergency) => ({
      messageList: emergency.list,
      loading: emergency.loading,
    })
  );

  const { messageList } = useSelector(selectEmergency);

  useEffect(() => {
    dispatch(getEmergencyMessages());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await dispatch(createEmergencyMessage({ text }));
    toast.success("Emergency message posted!");
    setText("");
    dispatch(getEmergencyMessages());
  };

  const handleReuse = async (msg: string) => {
    await dispatch(createEmergencyMessage({ text: msg }));
    toast.success("Message reused!");
    dispatch(getEmergencyMessages());
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await dispatch(deleteEmergencyMessage(id));
      toast.success("Message deleted");
      dispatch(getEmergencyMessages());
    }
  };

  return (
    <React.Fragment>
      <BreadCrumb title="Emergency Alerts" pageTitle='Dashboards'/>
      <ToastContainer closeButton={false} limit={1} />

      {/* Message Form */}
      <div className="card mb-4">
        <div className="card-body space-y-4">
          <h5 className="text-15">Post New Emergency Alert</h5>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="form-input w-full border dark:bg-zink-700 dark:border-zink-500 dark:text-white"
              placeholder="Enter emergency message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded text-sm"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Message List */}
      <div className="card">
        <div className="card-body">
          <h6 className="text-15 mb-4">Previous Messages</h6>
          {messageList && messageList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {messageList.map((msg: any) => (
                <div
                  key={msg.id}
                  className="border rounded-xl p-4 shadow-sm bg-white dark:bg-zink-700 dark:border-zink-500 flex flex-col justify-between"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-white mb-2">
                      {msg.text}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleReuse(msg.text)}
                      className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded self-start"
                    >
                      <RefreshCcw size={14} className="inline mr-1" />
                      Reuse
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      <Trash2 size={14} className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="noresult text-center py-8">
              <p className="text-slate-500 dark:text-zink-200">
                No emergency messages yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default EmergencyMessages;
