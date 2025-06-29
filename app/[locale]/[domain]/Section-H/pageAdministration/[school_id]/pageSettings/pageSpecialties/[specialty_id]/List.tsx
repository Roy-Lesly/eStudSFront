'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/DefaultLayout';
import { EdgeCourse, EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';

import MyTabs from '@/MyTabs';
import ExcelExporter from '@/ExcelExporter';
import Info from './Info';
import Students from './Students';
import Courses from './Courses';
import Transcript from './Transcript';
import { useRouter } from 'next/navigation';
import ServerError from '@/ServerError';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/serverActions/interfaces';
import PerformanceSpecialty from './PerformanceSpecialty';


export const metadata: Metadata = {
  title: "Specialty Page",
  description: "This is Specialty Page Admin Settings",
};

const List = ({ params, data, dataTrans, searchParams }: { params: any; data: any, dataTrans: any, searchParams: any }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode<JwtPayload>(token) : null;
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
          menuGroups={GetMenuAdministration()}
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
        department="Class Management"
        subRoute="List"
        pageName="Class Management"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/${params.profile_id}`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/${params.profile_id}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ? (
            <MyTabs
              tabs={[
                {
                  label: 'Info', content: data?.allSpecialties?.edges?.length ?
                    <Info data={data.allSpecialties.edges[0]} params={params} />
                    :
                    <ServerError type="notFound" item="Classes" />
                },
                {
                  label: 'Students', content: data?.allSchoolFees?.edges.length ?
                    <Students data={
                      data?.allSchoolFees?.edges.sort((a: EdgeSchoolFees, b: EdgeSchoolFees) => {
                        const fullNameA = a.node.userprofile.customuser.fullName.toLowerCase();
                        const fullNameB = b.node.userprofile.customuser.fullName.toLowerCase();
                        return fullNameA.localeCompare(fullNameB);
                      })}
                      params={params}
                    />
                    :
                    <ServerError type="notFound" item="Class" />,
                  icon: <ExcelExporter
                    data={activeTab === 1 ? data?.allSchoolFees?.edges : data?.allSpecialties?.edges}
                    title={activeTab === 1 ? `Class-${data?.allSpecialties?.edges[0].node?.academicYear.slice(2, 4)}-${data?.allSpecialties?.edges[0].node?.level?.level}-${data?.allSpecialties?.edges[0].node.mainSpecialty.specialtyName.slice(0, 19)}` : "Specialties"}
                    type={activeTab === 1 ? "SchoolFees" : "Specialty"}
                    page={activeTab === 1 ? "list_user_profile" : "list_specialty"}
                    searchParams={activeTab === 1 ? { "name": data?.allSpecialties?.edges[0].node.mainSpecialty.specialtyName } : searchParams}
                  />
                },
                {
                  label: 'Courses', content: data?.allCourses?.edges.length ?
                    <Courses data={
                      data?.allCourses?.edges.sort((a: EdgeCourse, b: EdgeCourse) => {
                        const courseNameA = a.node.mainCourse.courseName.toLowerCase();
                        const courseNameB = b.node.mainCourse.courseName.toLowerCase();
                        if (a.node.semester > b.node.semester) return 1;
                        if (a.node.semester < b.node.semester) return -1;
                        return courseNameA.localeCompare(courseNameB);
                      })}
                      params={params}
                    />
                    :
                    <ServerError type="notFound" item="Class" />
                },
                {
                  label: 'Performance', content: data?.allCourses?.edges.length ?
                    <PerformanceSpecialty
                      data={data?.allSpecialties?.edges[0].node}
                    />
                    :
                    <ServerError type="notFound" item="Class" />
                },
                ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("DOCUMENT") ?
                  [
                    {
                      label: 'Transcript', content: dataTrans?.resultDataSpecialtyTranscript ?
                        <Transcript
                          data={dataTrans?.resultDataSpecialtyTranscript}
                          params={params}
                          specialty_id={params.specialty_id}
                          searchParams={searchParams}
                        />
                        :
                        !searchParams?.trans ?
                          <div className='flex items-center justify-center my-24'>
                            <button
                              className='bg-blue-800 font-medium px-4 py-2 rounded text-lg text-white'
                              onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/${params.specialty_id}/?trans=${true}`)}>
                              Generate Transcripts For this Specialty
                            </button>
                          </div>
                          :
                          <ServerError type="notFound" item="Class" />
                    },
                  ] : []),
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

