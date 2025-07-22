import React from 'react';
import SearchComp from './SearchComp';
import UserCard from '@/components/componentsTwo/UserCard';
import FinanceChart from '@/components/componentsTwo/FinanceChart';
// import SpecialtyLevelIncountChart from '@/components/componentsTwo/SpecialtyLevelIncomeChart';

const AdminPage = (
  { p, sp, sortedAcadYears, apiLevels, financeChartData, userCardData, specialtyLevelCountChartData }
    :
    { p: any, sp: any, apiLevels: any, sortedAcadYears: string[], financeChartData: any, userCardData: { students: number, lecturers: number, admins: number, inactive: number, academic_year: string }, specialtyLevelCountChartData: any }) => {

  const results = specialtyLevelCountChartData || [];
  const chunkSize = results.length > 15 ? 15 : results.length > 10 ? 10 : results.length;
  const chunks: any[][] = [];

  for (let i = 0; i < results.length; i += chunkSize) {
    chunks.push(results.slice(i, i + chunkSize));
  }

  return (
    <div className="bg-slate-400 dark:bg-teal-800 flex flex-col gap-4 p-4 rounded-lg">

      <SearchComp p={p} sp={sp} sortedAcadYears={sortedAcadYears} />

      <div className="flex flex-col gap-4 w-full">
        {/* USER CARDS */}
        <div className="flex flex-col gap-4 justify-between md:flex-row">
          <UserCard data={{ id: 1, type: "Admins", count: userCardData.admins, date: userCardData.academic_year, icon: "/images/dash/parent.png" }} />
          <UserCard data={{ id: 2, type: "Lecturers", count: userCardData.lecturers, date: userCardData.academic_year, icon: "/images/dash/student.png" }} />
          <UserCard data={{ id: 3, type: "Students", count: userCardData.students, date: userCardData.academic_year, icon: "/images/dash/maleFemale.png" }} />
          <UserCard data={{ id: 4, type: "Not Active", count: userCardData.inactive, date: userCardData.academic_year, icon: "/images/dash/moreDark.png" }} />
        </div>

        <div className="h-[500px] text-black w-full">
          <FinanceChart data={financeChartData} />
        </div>

        {/* SPECIALTY CHART */}
        <div className="flex flex-col gap-4 h-full w-full">
          {chunks.map((chunk, index) => (
            <div key={index} className="h-[370px] w-full">
              {/* <SpecialtyLevelIncountChart data={chunk} levels={apiLevels} /> */}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};



export default AdminPage;
