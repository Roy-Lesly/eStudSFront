'use client';
import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { PDFViewer } from "@react-pdf/renderer";
import TransOneYear from './Comps/TransOneYear';


const List = ({ params, dataTrans, searchParams }: { params: any; dataTrans: any, searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      pageType='admin'
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
        department="Transcript"
        subRoute="List"
        pageName="Transcript"
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`}
      />

      <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">
        <div className="flex flex-col items-center justify-center w-full">

          {dataTrans?.resultDataSpecialtyTranscript?.length > 0 ?
            dataTrans?.resultDataSpecialtyTranscript[0].platform ?
              <PDFViewer
                style={{
                  width: "100%",
                  height: "calc(100vh - 100px)",
                  maxWidth: "1200px",
                }}
              >
                <TransOneYear
                  dataResult={dataTrans?.resultDataSpecialtyTranscript?.filter((item: any) => item.platform)}
                  params={params}
                  dataHeader={dataTrans?.specialtyAndSchoolInfo}
                />
              </PDFViewer>
              :
              <div className="my-20 text-2xl text-bold">Account Active</div>
            :
            <div>No transcript data available</div>
          }
        </div>
      </div>
    </DefaultLayout>
  );
};

export default List;