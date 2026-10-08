import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ParentSidebar } from '../components/ParentSidebar';
import { ParentTopbar } from '../components/ParentTopbar';
import { academyService } from '../../../services/api';

export const ParentLayout = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    academyService.getParentDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex relative">
      <ParentSidebar />
      <div className="pl-72 flex-1 min-h-screen flex flex-col">
        <ParentTopbar />
        <Outlet context={{ data }} />
      </div>
    </div>
  );
};
