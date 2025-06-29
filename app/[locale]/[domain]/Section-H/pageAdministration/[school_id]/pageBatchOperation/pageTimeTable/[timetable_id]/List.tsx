'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { EdgeCourse, EdgeHall, EdgeTimeTable } from '@/Domain/schemas/interfaceGraphql';
import { useRouter } from 'next/navigation';
import TimeTableCard from './TimeTableCard';


export const metadata: Metadata = {
  title: "Users Page",
  description: "This is Users Page Admin Settings",
};


export const parseJson = (data: string | Record<string, boolean>): Record<string, boolean> => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return {};
    }
  }
  return data;
};

const List = (
  { params, dataAllTimeTables, apiCourses, apiHalls }
    :
    { params: any; dataAllTimeTables: any, searchParams: any, apiCourses: EdgeCourse[], apiHalls: EdgeHall[] }
) => {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();


  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={<SearchMultiple
        names={['specialtyName', "year", "month"]}
        link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable`}
        select={[
          // { type: 'select', name: 'sex', dataSelect: ['MALE', 'FEMALE'] },
        ]}
      />}
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

      {dataAllTimeTables && dataAllTimeTables.length ? <div className="w-full mx-auto p-2">
        <div className='flex justify-between items-center mb-2 text-black'>
          <h1 className="text-2xl font-bold text-center">📅 TimeTable Schedule</h1>
          <h1 className="text-xl font-bold text-center">Class: <code>{dataAllTimeTables[0].node.specialty?.mainSpecialty?.specialtyName} - {dataAllTimeTables[0].node.specialty?.academicYear} - {dataAllTimeTables[0].node.specialty?.level?.level}</code></h1>
        </div>
        <div className="space-y-2">
          {dataAllTimeTables?.map((timetable: EdgeTimeTable) => (
            <TimeTableCard
              key={timetable.node.id}
              timetable={timetable}
              apiCourses={apiCourses}
              apiHalls={apiHalls}
            />
          ))}
        </div>
      </div>
        :
        <ServerError type='notFound' />
      }

    </DefaultLayout >
  );
};

export default List;


