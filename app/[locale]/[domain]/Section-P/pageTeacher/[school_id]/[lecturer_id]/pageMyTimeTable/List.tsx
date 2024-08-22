'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { GetMenuLecturer } from '@/section-h/Sidebar/MenuLecturer';
import SearchMultiple from '@/Search/SearchMultiple';
import { useTranslation } from 'react-i18next';
import ComingSoon from '@/ComingSoon';

export const metadata: Metadata = {
  title: "Assigned Subjects Page",
  description: "e-conneq School System. Assigned Subjects Page Admin Settings",
};


const List = ({ params, data }: { params: any; data: any }) => {
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={["courseName"]}
          link={`/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyCourses`}
        />
      }
      sidebar={
        <Sidebar
          params={params}
          menuGroups={GetMenuLecturer(params)}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      }
      headerbar={
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchComponent={
            <h1>Lecturer</h1>
          }
        />
      }
    >


      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-4">
        <ComingSoon />

      </div>
    </DefaultLayout>
  );
};

export default List;
