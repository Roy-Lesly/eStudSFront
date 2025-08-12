'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import { EdgeSchoolIdentification, EdgeSchoolInfoHigher } from '@/Domain/schemas/interfaceGraphql';
import { GetMenuAdministration as GetMenuHigher } from '@/section-h/Sidebar/MenuAdministration';
import { GetMenuAdministration as GetMenuSecondary } from '@/section-s/Sidebar/MenuAdministration';
import { GetMenuAdministration as GetMenuPrimary } from '@/section-p/Sidebar/MenuAdministration';
import { GetMenuAdministration as GetMenuVocational } from '@/section-p/Sidebar/MenuAdministration';
import MyTabs from '@/MyTabs';
import { useTranslation } from 'react-i18next';
import ServerError from '@/ServerError';
import TabSchoolIdentification from './TabSchoolIdentificationGeneral';
import TabSchoolInfo from './TabSchoolInfo';



const ListSchoolInfo = (
  { p, data, sp, identification, section }:
    {
      p: any; data: EdgeSchoolInfoHigher | any, sp: any, identification: EdgeSchoolIdentification,
      section: "H" | "S" | "P" | "V"
    }
) => {

  const { t } = useTranslation();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(parseInt(sp?.tab) || 0);

  return (
    <DefaultLayout
      pageType='admin'
      domain={p.domain}
      searchComponent={null}
      sidebar={
        <Sidebar
          params={p}
          menuGroups={section === "H" ? GetMenuHigher() : section === "S" ? GetMenuSecondary() : section ==="P" ? GetMenuPrimary() : GetMenuVocational()} 
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
                  label: t("General"),
                  content: <TabSchoolIdentification
                    data={identification}
                    params={p}
                  />
                },
                {
                  label: t("Campus"),
                  content: <TabSchoolInfo
                    data={data}
                    params={p}
                    section={section}
                  />
                },
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              source={`/Section-${section}/pageAdministration/${p.school_id}/pageManagement/pageSchoolInfo/?`}
            />
            :
            <ServerError type="network" item='' />}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ListSchoolInfo;