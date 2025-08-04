import React, { useEffect,  useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { ToastContainer, toast } from "react-toastify";
import {
  createComplaint,
  deleteComplaint,
  getMyComplaints,
  updateComplaint,
} from "slices/complaints/thunk";
import BreadCrumb from "Common/BreadCrumb";
import { Trash2, Pencil, UploadCloud } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ComplaintsPage = () => {
  const dispatch = useDispatch<any>();

  const selectComplaints = createSelector(
    (state: any) => state.Complaints,
    (complaints) => ({
      complaintList: complaints.list,
      loading: complaints.loading,
    })
  );

  const { complaintList } = useSelector(selectComplaints);
  const [formData, setFormData] = useState({ text: "", files: [] as File[] });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getMyComplaints());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("text", formData.text);
    formData.files.forEach((file) => data.append("files", file));

    if (editingId !== null) {
      await dispatch(updateComplaint({ id: editingId, formData: data }));
      toast.success("Complaint updated!");
    } else {
      await dispatch(createComplaint(data));
      dispatch(getMyComplaints());
      toast.success("Complaint created!");
    }

    setFormData({ text: "", files: [] });
    setEditingId(null);
    dispatch(getMyComplaints());
  };

  const handleDelete = useCallback(
    async (id: number) => {
      if (window.confirm("Are you sure you want to delete this complaint?")) {
        await dispatch(deleteComplaint(id));
        toast.success("Complaint deleted");
        dispatch(getMyComplaints());
      }
    },
    [dispatch]
  );

  const handleEdit = (complaint: any) => {
    setEditingId(complaint.id);
    setFormData({ text: complaint.text_content, files: [] });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, files: Array.from(e.target.files) });
    }
  };



  return (
    <React.Fragment>
      <BreadCrumb title="Posts" pageTitle="Dashboard" />
      <ToastContainer closeButton={false} limit={1} />

      <div className="card mb-4">
        <div className="card-body space-y-4">
          <h5 className="text-15">Create / Update Complaint</h5>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              className="form-input w-full border dark:bg-zink-700 dark:border-zink-500 dark:text-white"
              placeholder="Enter complaint text"
              rows={3}
              required
            />
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-custom-500">
                <UploadCloud size={18} />
                <span>Select Files</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {formData.files.length > 0 && (
                <span className="text-sm text-slate-500 dark:text-zink-200">
                  {formData.files.length} file(s) selected
                </span>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-custom-500 hover:bg-custom-600 rounded text-sm"
            >
              {editingId ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h6 className="text-15 mb-4">My Complaints</h6>
          {complaintList && complaintList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {complaintList.map((complaint: any) => (
                <div
                  key={complaint.id}
                  className="border rounded-xl p-4 shadow-sm bg-white dark:bg-zink-700 dark:border-zink-500"
                >
                  <div className="mb-3">
                    {/* Show first file preview */}
                    {complaint.files.length > 0 &&
                      (() => {
                        const file = complaint.files[0];
                        if (file.file_type === "image") {
                          return (
                            <img
                              src={file.file_url}
                              alt="complaint"
                              className="w-full h-48 object-cover rounded-md"
                            />
                          );
                        } else if (file.file_type === "audio") {
                          return (
                            <audio
                              controls
                              src={file.file_url}
                              className="w-full"
                            />
                          );
                        } else if (file.file_type === "video") {
                          return (
                            <video
                              controls
                              src={file.file_url}
                              className="w-full h-48 rounded-md"
                            />
                          );
                        } else {
                          return (
                            <a
                              href={file.file_url}
                              download
                              className="text-blue-500 underline text-sm"
                            >
                              📄 Download Document
                            </a>
                          );
                        }
                      })()}
                  </div>

                  <p className="text-sm text-gray-700 dark:text-white mb-2">
                    {complaint.text_content}
                  </p>

                  <p className="text-xs text-gray-400 mb-3">
                    {new Date(complaint.created_at).toLocaleString()}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(complaint)}
                      className="px-3 py-1 text-xs bg-custom-500 hover:bg-custom-600 text-white rounded"
                    >
                      <Pencil size={14} className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(complaint.id)}
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
                No complaints found.
              </p>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ComplaintsPage;
