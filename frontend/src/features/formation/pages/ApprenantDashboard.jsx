import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { ProgramProgressCard } from '../components/dashboard/ProgramProgressCard';
import { UpcomingDeadlineCard } from '../components/dashboard/UpcomingDeadlineCard';
import { FinancialDeadlineCard } from '../components/dashboard/FinancialDeadlineCard';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { ScheduleCard } from '../components/dashboard/ScheduleCard';
import { EvaluationsCard } from '../components/dashboard/EvaluationsCard';
import { DocumentsCard } from '../components/dashboard/DocumentsCard';

export const ApprenantDashboard = () => {
  const { data } = useOutletContext();

  return (
    <>
      <WelcomeBanner bordereauxPublished={data?.program?.bordereauxPublished} />
      
      <div className="mt-space-md grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          <ProgramProgressCard data={data.program} />
          <MetricsGrid data={data} />
        </div>
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          <UpcomingDeadlineCard data={data.tasks} />
          <FinancialDeadlineCard data={data.financial} />
        </div>
      </div>
      
      {/* Bento Section 1: Timetable & Upcoming Tasks */}
      <div className="mt-space-md grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        <ScheduleCard data={data.schedule} />
        <EvaluationsCard data={{ grades: data.grades, tasks: data.tasks?.slice(1) || [] }} />
      </div>
      
      {/* Bento Section 2: Course Documents */}
      <div className="mt-space-md flex flex-col">
        <DocumentsCard data={data.documents} />
      </div>
    </>
  );
};

export default ApprenantDashboard;
