'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import SearchMultiple from '@/Search/SearchMultiple';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTabs from '@/MyTabs';
import { GetMenuAccounting } from '@/section-h/Sidebar/MenuAccounting';
import MyTableComp from '@/components/Table/MyTableComp';
import { CountByDomain, CountBySpecialty } from '@/Domain/schemas/interfaceGraphqlKPI';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';


export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "e-conneq School System. Main-Subject Page Admin Settings",
};

const List = ({ p, data, dataYears, sp }: { p: any; data: any, sp: any, dataYears: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(parseInt(sp?.tab) || 0);

  const ColumnsDomain: TableColumn<CountByDomain>[] = [
    { header: "#", align: "center", render: (_item: CountByDomain, index: number) => index + 1, },
    { header: "Domain Name", accessor: "domainName", align: "left" },
    { header: "Classes #", accessor: "specialties", align: "left" },
    { header: "Courses #", accessor: "courses", align: "left" },
    { header: "Students #", accessor: "userProfiles", align: "left" },
  ];
  const ColumnsSpecialty: TableColumn<CountBySpecialty>[] = [
    { header: "#", align: "center", render: (_item: CountBySpecialty, index: number) => index + 1, },
    { header: "Specialty Name", accessor: "specialtyName", align: "left" },
    { header: "Level", accessor: "level", align: "left" },
    { header: "Courses #", accessor: "courses", align: "left" },
    { header: "Students #", accessor: "userProfiles", align: "left" },
  ];


  return (
    <DefaultLayout
      pageType='admin'
      domain={p.domain}
      searchComponent={
        <SearchMultiple
          names={["academicYear"]}
          link={`/${p.domain}/Section-H/pageAccounting/${p.school_id}/AnalysisSystemCounts`}
          select={[
            // { type: 'select', name: 'academicYear', dataSelect: dataYears?.allAcademicYears },
          ]}
        />
      }
      sidebar={
        <Sidebar
          params={p}
          menuGroups={GetMenuAccounting()}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      }
      headerbar={
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchComponent={
            <></>
          }
        />
      }
    >
      <Breadcrumb
        department="Counts"
        subRoute="List"
        pageName="System Counts"
        mainLink={`${p.domain}/Section-H/pageAccounting/${p.school_id}/AnalysisSystemCounts`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">

          <div className='flex items-center justify-center'>
            {sp && sp?.academicYear ?
              <span className='font-semibold my-2 rounded text-xl'>{sp?.academicYear}</span>
              :
              <span className='font-medium my-24 p-4 rounded text-lg'>Please Select Academic Year</span>}
          </div>

          {data && !data?.error ? (
            <MyTabs
              tabs={[
                {
                  label: 'Domains', content: data?.totalCountsByAcademicYearAndSchool?.domains.length ?
                    <MyTableComp
                      data={
                        data?.totalCountsByAcademicYearAndSchool?.domains.sort((a: CountByDomain, b: CountByDomain) => {
                          return a.domainName > b.domainName ? 1 : a.domainName < b.domainName ? -1 : 0
                        })}
                      columns={ColumnsDomain}
                    />
                    :
                    <ServerError type="notFound" item="Counts" />
                },
                {
                  label: 'Classes', content: data?.totalCountsByAcademicYearAndSchool?.specialties.length ?
                    <MyTableComp
                      data={
                        data?.totalCountsByAcademicYearAndSchool?.specialties.sort((a: CountBySpecialty, b: CountBySpecialty) => {
                          const specialtyNameA = a.specialtyName.toLowerCase();
                          const specialtyNameB = b.specialtyName.toLowerCase();
                          const levelA = a.level;
                          const levelB = b.level;
                          if (specialtyNameA > specialtyNameB) return 1;
                          if (specialtyNameA < specialtyNameB) return -1;
                          if (levelA > levelB) return 1;
                          if (levelA < levelB) return -1;
                        })}
                      columns={ColumnsSpecialty}
                    />
                    :
                    <ServerError type="notFound" item="Counts" />
                },
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              source={`Section-H/pageAccounting/${p.school_id}/AnalysisSystemCounts/?academicYear=${sp.academicYear}`}
            />
          )
            :
            <>
              {data?.error && data?.error === "Not Authenticated" ? <ServerError type="authentication" item="Courses" /> : null}
              {data?.error && data?.error === "Not Authenticated" ? <ServerError type="network" item="Courses" /> : null}
            </>
          }
        </div>

      </div>
    </DefaultLayout>
  );
};

export default List;