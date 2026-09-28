import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ApprenantSidebar } from '../components/ApprenantSidebar';
import { ApprenantTopbar } from '../components/ApprenantTopbar';
import { academyService } from '../../../services/api';

export const ApprenantLayout = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    academyService.getApprenantDashboard()
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
      <ApprenantSidebar />
      <div className="pl-72 flex-1 min-h-screen flex flex-col">
        <ApprenantTopbar />
        <main className="relative pt-16 bg-surface min-h-screen w-full px-space-lg">
          <div className="flex flex-col w-full pb-space-xl">
            {loading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-az-blue border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-slate-500 font-medium animate-pulse">Chargement de votre espace...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600">
                <h3 className="font-bold text-lg mb-2">Erreur de connexion</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Réessayer</button>
              </div>
            ) : (
              <Outlet context={{ data }} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
