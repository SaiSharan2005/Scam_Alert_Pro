import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import Select from "react-select";

// Icons
import {
  Search,
  CheckCircle,
  Loader,
} from "lucide-react";

// react-redux
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { getUserList as onGetUserList } from "slices/thunk";
import { ToastContainer } from "react-toastify";
import filterDataBySearch from "Common/filterDataBySearch";

const ListView = () => {
  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
    (state: any) => state.Users,
    (user) => ({
      userList: user.userList,
    })
  );

  const { userList } = useSelector(selectDataList);
  const [user, setUser] = useState<any>([]);

  // Get Data
  useEffect(() => {
    dispatch(onGetUserList());
  }, [dispatch]);

  useEffect(() => {
    setUser(userList); // <- set data to state when redux updates
  }, [userList]);

  // Search Data
  const filterSearchData = (e: any) => {
    const search = e.target.value;
    const keysToSearch = ["name", "designation", "email", "status"];
    filterDataBySearch(userList, search, keysToSearch, setUser);
  };

  // columns
  const Status = ({ item }: any) => {
    switch (item) {
      case "Active":
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent inline-flex items-center status">
            <CheckCircle className="size-3 mr-1.5" />
            {item}
          </span>
        );
      case "InActive":
        return (
          <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-slate-100 border-transparent text-slate-500 dark:bg-slate-500/20 dark:text-zink-200 dark:border-transparent status">
            <Loader className="size-3 mr-1.5" />
            {item}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent inline-flex items-center status">
            <CheckCircle className="size-3 mr-1.5" />
            {item}
          </span>
        );
    }
  };

  const columns = useMemo(
    () => [

      {
        header: "User ID",
        accessorKey: "userId",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link
            to="#!"
            className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600 user-id"
          >
            {cell.getValue()}
          </Link>
        ),
      },
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-10 font-medium rounded-full shrink-0 bg-slate-200 text-slate-800 dark:text-zink-50 dark:bg-zink-600">
              {cell.row.original.img ? (
                <img
                  src={cell.row.original.img}
                  alt=""
                  className="h-10 rounded-full"
                />
              ) : (
                cell
                  .getValue()
                  .split(" ")
                  .map((word: any) => word.charAt(0))
                  .join("")
              )}
            </div>
            <div className="grow">
              <h6 className="mb-1">
                <Link to="#!" className="name">
                  {cell.getValue()}
                </Link>
              </h6>
              <p className="text-slate-500 dark:text-zink-200">
                {cell.row.original.designation}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Phone Number",
        accessorKey: "phoneNumber",
        enableColumnFilter: false,
      },
      {
        header: "Joining Date",
        accessorKey: "joiningDate",
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => <Status item={cell.getValue()} />,
      },
    ],
    []
  );

  const options = [
    { value: "Select Status", label: "Select Status" },
    { value: "Active", label: "Active" },
    { value: "InActive", label: "InActive" },
  ];

  const handleChange = (selectedOption: any) => {
    if (
      selectedOption.value === "Select Status" ||
      selectedOption.value === "Active"
    ) {
      setUser(userList);
    } else {
      const filteredUsers = userList.filter(
        (data: any) => data.status === selectedOption.value
      );
      setUser(filteredUsers);
    }
  };

  return (
    <React.Fragment>
      <BreadCrumb title="List View" pageTitle='Dashboards' />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="usersTable">
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-15 grow">Users List</h6>
              </div>
            </div>
            <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
              <form action="#!">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                  <div className="relative xl:col-span-2">
                    <input
                      type="text"
                      className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      placeholder="Search for name, email, phone number etc..."
                      autoComplete="off"
                      onChange={(e) => filterSearchData(e)}
                    />
                    <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                  </div>
                  <div className="xl:col-span-2">
                    <Select
                      className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      options={options}
                      isSearchable={false}
                      defaultValue={options[0]}
                      onChange={(event: any) => handleChange(event)}
                      id="choices-single-default"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="card-body">
              {user && user.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={user || []}
                  customPageSize={10}
                  divclassName="-mx-5 -mb-5 overflow-x-auto"
                  tableclassName="w-full border-separate table-custom border-spacing-y-1 whitespace-nowrap"
                  theadclassName="text-left relative rounded-md bg-slate-100 dark:bg-zink-600 after:absolute ltr:after:border-l-2 rtl:after:border-r-2 ltr:after:left-0 rtl:after:right-0 after:top-0 after:bottom-0 after:border-transparent [&.active]:after:border-custom-500 [&.active]:bg-slate-100 dark:[&.active]:bg-zink-600"
                  thclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold"
                  tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5"
                  PaginationClassName="flex flex-col items-center mt-8 md:flex-row"
                />
              ) : (
                <div className="noresult">
                  <div className="py-6 text-center">
                    <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                    <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                    <p className="mb-0 text-slate-500 dark:text-zink-200">
                      We've searched more than 199+ users We did not find any
                      users for you search.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ListView;
