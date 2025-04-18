'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { EdgeResult } from '@/Domain/schemas/interfaceGraphql';

import MyTabs from '@/MyTabs';
import ExcelExporter from '@/ExcelExporter';
import Info from './Info';
import Students from './Students';
import { useRouter } from 'next/navigation';
import PerformanceCourse from './PerformanceCourse';


export const metadata: Metadata = {
  title: "Specialty Page",
  description: "This is Specialty Page Admin Settings",
};

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  return (
    <DefaultLayout
      domain={params.domain}
      searchComponent={
        <></>
      }
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
            <></>
          }
        />
      }
    >
      <Breadcrumb
        department="Course Management"
        subRoute="List"
        pageName="Course Management"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/pageCourses/${params.profile_id}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ? (
            <MyTabs
              tabs={[
                {
                  label: 'Info', content: data?.allCourses?.edges?.length ?
                    <Info data={data.allCourses.edges[0]} params={params} />
                    :
                    <ServerError type="notFound" item="Courses" />
                },
                {
                  label: 'Performance', content: data?.allCourses?.edges?.length ?
                    <PerformanceCourse 
                      data={data.allCourses.edges[0].node}
                    />
                    :
                    <ServerError type="notFound" item="Courses" />
                },
                {
                  label: 'Students', content: data?.allResults?.edges.length ?
                    <Students data={
                      data?.allResults?.edges.sort((a: EdgeResult, b: EdgeResult) => {
                        const fullNameA = a.node.student.user.fullName.toLowerCase();
                        const fullNameB = b.node.student.user.fullName.toLowerCase();
                        return fullNameA.localeCompare(fullNameB);
                      })}
                      params={params}
                    />
                    :
                    <ServerError type="notFound" item="Course" />, 
                    icon: <ExcelExporter
                      data={activeTab === 1 ? data?.allSchoolFees?.edges : data?.allSpecialties?.edges}
                      title={activeTab === 1 ? `Class-${data?.allSpecialties?.edges[0].node?.academicYear.slice(2, 4)}-${data?.allSpecialties?.edges[0].node?.level?.level}-${data?.allSpecialties?.edges[0].node.mainSpecialty.specialtyName.slice(0, 19)}` : "Specialties"}
                      type={activeTab === 1 ? "SchoolFees" : "Specialty"}
                      page={activeTab === 1 ? "list_user_profile" : "list_specialty"}
                      searchParams={activeTab === 1 ? { "name": data?.allSpecialties?.edges[0].node.mainSpecialty.specialtyName } : searchParams}
                    />
                },
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ) : (
            <ServerError type="network" item="Class" />
          )}
        </div>

      </div>
    </DefaultLayout>
  );
};

export default List;

