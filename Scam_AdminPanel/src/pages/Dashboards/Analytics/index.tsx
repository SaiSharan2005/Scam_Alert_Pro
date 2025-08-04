import React from 'react';
import BreadCrumb from 'Common/BreadCrumb';
import Widgets from './Widgets';

const Analytics = () => {

  return (
    <React.Fragment>
      <BreadCrumb title='Analytics' pageTitle='Dashboards' />
      <div className="grid grid-cols-12 gap-x-5">
        <Widgets />
      </div>
    </React.Fragment>
  );
};

export default Analytics;
