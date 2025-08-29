'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/DefaultLayout';
import { EdgeUserProfile } from '@/Domain/schemas/interfaceGraphql';
import ServerError from '@/ServerError';
import { useTranslation } from 'react-i18next';
import { EdgeAttendanceGeneralSecondary, EdgeClassRoomSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import AttendanceList from '@/app/[locale]/[domain]/SectionAll/AttendanceList';
import { decodeUrlID } from '@/utils/functions';


export const metadata: Metadata = {
  title: "Attendance Page",
  description: "e-conneq School System. Attendance Page Admin Settings",
};

const List = (
  { p, data, sp, classroom, attendance }:
    { p: any, data: EdgeUserProfile[], sp: any, classroom: EdgeClassRoomSec, attendance: EdgeAttendanceGeneralSecondary }
) => {

  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      domain={p.domain}
      searchComponent={
        null
      }
      sidebar={
        <Sidebar
          params={p}
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
            null
          }
        />
      }
    >
      <Breadcrumb
        department={`${t("")}`}
        subRoute={`${classroom?.node?.level} - ${classroom?.node?.classType} - ${classroom?.node?.academicYear}`}
        pageName={`${t("Class Attendance")}`}
        mainLink={`${p.domain}/Section-S/pageAdministration/${p.school_id}/Settings/Students/${p.profile_id}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">

        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ?
            <AttendanceList
              section='S'
              data={data}
              p={p}
              sp={sp}
              instance={attendance?.node}
              // apiYears={apiYears}
              classroomId={parseInt(decodeUrlID(classroom?.node?.id))}
            />
            :
            <ServerError type="network" item="Class" />
          }
        </div>

      </div>
    </DefaultLayout>
  );
};

export default List;

