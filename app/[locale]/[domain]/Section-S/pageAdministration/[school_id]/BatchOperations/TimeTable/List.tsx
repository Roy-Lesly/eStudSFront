'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import SearchMultiple from '@/section-s/Search/SearchMultiple';
import ComingSoon from '@/ComingSoon';

export const metadata: Metadata = {
  title: "TimeTable Page",
  description: "This is TimeTable Page Admin Settings",
};

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
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
        department="TimeTable"
        subRoute="List"
        pageName="TimeTable"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/BatchOperations/TimeTable/Performance/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/BatchOperations/TimeTable/Performance/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        {searchParams?.type === "timetable" ?
          data ?
            data.allSubjects?.edges.length ? <></>
              // <DataSubjects data={data?.allSubjects?.edges} params={params} />
              :
              <ServerError type="notFound" item="TimeTable" />
            :
            // <ServerError type="network" item="TimeTable" />
            <ComingSoon />
          :
          null
        }

      </div>
    </DefaultLayout>
  );
};

export default List;