'use client';

import React, { useState } from 'react'; // Importing icons
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import SearchMultiple from '@/section-s/Search/SearchMultiple';
import ResultsSelectClass from './Results/ResultsSelectClass';
import TimeTableSelectClass from './TimeTable/TimeTableSelectClass';

export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "This is Main-Subject Page Admin Settings",
};

const List = ({ pageType, params, searchParams, data }: { pageType: "results" | "timetable", params: any, searchParams: any, data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);


  return (
    <DefaultLayout
      domain={params.domain}
      sidebar={
        <Sidebar
          params={params}
          menuGroups={getMenuAdministration(params)}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      }
      headerbar={
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchComponent={
            <SearchMultiple
              names={['fullName', 'telephone']}
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Users`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Batch Operation"
        subRoute="List"
        pageName="Batch Operation"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/BatchOperations/?pageType=${pageType}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


              {pageType === "results" ? <ResultsSelectClass params={params} searchParams={searchParams} data={data} /> : null}   
              {pageType === "timetable" ? <TimeTableSelectClass params={params} searchParams={searchParams} data={data} /> : null}   
        

      </div>
    </DefaultLayout>
  );
};

export default List;