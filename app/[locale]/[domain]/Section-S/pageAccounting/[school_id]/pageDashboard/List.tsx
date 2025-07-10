import React from 'react';
import SearchComp from './SearchComp';
import AdminPage from './AdminPage';

const List = (
  {
    userCardData,
    financeChartData,
    specialtyLevelCountChartData,
    sortedAcadYears,
    apiLevels,
    p,
    sp,
  }: {
    userCardData: any,
    financeChartData: any,
    specialtyLevelCountChartData: any,
    sortedAcadYears: string[],
    apiLevels: any,
    p: any,
    sp: any,
  }
) => {

  return (
    <>
      {specialtyLevelCountChartData && specialtyLevelCountChartData.length > 0 && financeChartData ?
        <AdminPage
          p={p} sp={sp}
          sortedAcadYears={sortedAcadYears} apiLevels={apiLevels}
          userCardData={userCardData} financeChartData={financeChartData}
          specialtyLevelCountChartData={specialtyLevelCountChartData}
        />
        :
        <div>
          <SearchComp p={p} sp={sp} sortedAcadYears={sortedAcadYears} />
          <div className="flex flex-col items-center justify-center mt-40 rounded">
            <div className="bg-white flex font-medium p-10 text-xl tracking-widest">No Campus Data Generated Yet !</div>
          </div>

        </div>
      }

    </>
  );
}

export default List;
