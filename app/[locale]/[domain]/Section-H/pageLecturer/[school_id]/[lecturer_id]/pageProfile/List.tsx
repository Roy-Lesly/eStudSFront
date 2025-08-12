'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import { Metadata } from 'next';
import { GetMenuLecturer } from '@/section-h/Sidebar/MenuLecturer';
import { useTranslation } from 'react-i18next';
import MyProfile from './MyProfile';

export const metadata: Metadata = {
  title: "Assigned Subjects Page",
  description: "e-conneq School System. Assigned Subjects Page Admin Settings",
};


const List = ({ params, data }: { params: any; data: any }) => {
  const { t } = useTranslation("common")
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      domain={params.domain}
      searchComponent={<></>
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
            <h1>{t("Lecturer")}</h1>
          }
        />
      }
    >


      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-4 font-medium text-black">
        <MyProfile
          userInfo={data?.allCustomusers?.edges?.[0]?.node}
          p={params}
        />

      </div>
    </DefaultLayout>
  );
};

export default List;

