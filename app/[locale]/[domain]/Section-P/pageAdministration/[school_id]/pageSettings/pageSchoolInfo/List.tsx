'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-p/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Info from './Info';
import DefaultLayout from '@/DefaultLayout';
import { EdgeSchoolInfoHigher } from '@/Domain/schemas/interfaceGraphql';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import MyTabs from '@/MyTabs';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { JwtPayload } from '@/serverActions/interfaces';
import ServerError from '@/ServerError';



const List = ({ p, data, s }: { p: any; data: EdgeSchoolInfoHigher | any, s: any }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode<JwtPayload>(token) : null;

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);

  console.log(data);
  return (
    <DefaultLayout
      pageType='admin'
      domain={p.domain}
      searchComponent={<></>}
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
          searchComponent={<></>}
        />
      }
    >

      <div className="bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ?
            <MyTabs
              tabs={[
                {
                  label: t("Info"),
                  content: <Info
                    // searchParams={s}
                    data={data}
                    params={p}
                  />
                },

                // {
                //   label: t("Classes"),
                //   content: <Classes data={data?.allSchoolFees?.edges} params={params} />
                // },

                // ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("FEES") ?
                //   [
                //     {
                //       label: t("Fees"),
                //       content: <Fees
                //         p={params}
                //         schoolFees={data?.allSchoolFees?.edges.length ? data?.allSchoolFees?.edges[0].node : null}
                //         data={data.allSchoolFees?.edges.filter((item: EdgeSchoolFees) => decodeUrlID(item.node.userprofile.id) === decodeUrlID(p.student_id))[0]}
                //       />
                //     }
                //   ] : []),
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              source={`/${p.locale}/${p.domain}/Section-S/pageAdministration/${p.school_id}/pageStudents/${p.student_id}`}
            />
            :
            <ServerError type="network" item='' />}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default List;