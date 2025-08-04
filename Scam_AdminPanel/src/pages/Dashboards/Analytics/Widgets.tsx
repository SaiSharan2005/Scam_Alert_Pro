import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Kanban, Users } from "lucide-react";
import CountUp from "react-countup";
import { getDashboard } from "slices/dashboard/thunk";
import { createSelector } from "reselect";

const Widgets = () => {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  const selectDashboard = createSelector(
    (state: any) => state.Dashboard,
    (dashboard) => ({
      counts: dashboard.list,
      loading: dashboard.loading,
    })
  );

  const { counts, loading } = useSelector(selectDashboard);

  if (loading || !counts) return <div>Loading...</div>;

  return (
    <React.Fragment>
      {/* Total Users */}
      <div className="order-1 md:col-span-6 lg:col-span-3 col-span-12 2xl:order-1 bg-green-100 dark:bg-green-500/20 card 2xl:col-span-2 group-data-[skin=bordered]:border-green-500/20 relative overflow-hidden">
        <div className="card-body">
          <Kanban className="absolute top-0 size-32 stroke-1 text-green-200/50 dark:text-green-500/20 ltr:-right-10 rtl:-left-10" />
          <div className="flex items-center justify-center size-12 bg-green-500 rounded-md text-15 text-green-50">
            <Users />
          </div>
          <h5 className="mt-5 mb-2">
            <CountUp end={counts.users} className="counter-value" />
          </h5>
          <p className="text-slate-500 dark:text-slate-200">Total Users</p>
        </div>
      </div>

      {/* Total Complaints */}
      <div className="order-2 md:col-span-6 lg:col-span-3 col-span-12 2xl:order-2 bg-blue-100 dark:bg-blue-500/20 card 2xl:col-span-2 group-data-[skin=bordered]:border-blue-500/20 relative overflow-hidden">
        <div className="card-body">
          <Kanban className="absolute top-0 size-32 stroke-1 text-blue-200/50 dark:text-blue-500/20 ltr:-right-10 rtl:-left-10" />
          <div className="flex items-center justify-center size-12 bg-blue-500 rounded-md text-15 text-blue-50">
            <Kanban />
          </div>
          <h5 className="mt-5 mb-2">
            <CountUp end={counts.complaints} className="counter-value" />
          </h5>
          <p className="text-slate-500 dark:text-slate-200">Total Posts</p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Widgets;
