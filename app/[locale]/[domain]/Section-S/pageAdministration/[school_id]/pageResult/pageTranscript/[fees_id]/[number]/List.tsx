'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { PDFViewer } from "@react-pdf/renderer";
import { GetMenuAdministration } from '@/components/section-h/Sidebar/MenuAdministration';
import TransOneYear from '../Comps/TransOneYear';
import TransTwoYear from '../Comps/TransTwoYear';
import TransThreeYear from '../Comps/TransThreeYear';
import { useTranslation } from 'react-i18next';


const List = (
  { params, dataTrans, searchParams, dataInfo }:
    { params: any; dataTrans: any, searchParams: any, dataInfo: any }
) => {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { t } = useTranslation("common");

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
        department="Transcript"
        subRoute="List"
        pageName="Transcript"
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`}
      />

      <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">
        <div className="flex flex-col items-center justify-center w-full">

          {dataTrans?.length > 0 ?
            // dataTrans?.transcriptCoursesResults[0].platform ?
            <PDFViewer
              style={{
                width: "100%",
                height: "calc(100vh - 100px)",
                maxWidth: "1200px",
              }}
            >

              <>
                {dataTrans?.length === 1 &&
                  <TransOneYear
                    dataResult={dataTrans[0]}
                    dataInfo={dataInfo}
                    params={params}
                  />}

                {dataTrans.length === 2 &&
                  <TransTwoYear
                    dataResult={dataTrans}
                    dataInfo={dataInfo}
                    params={params}
                  />}

                {dataTrans.length === 3 &&
                  <TransThreeYear
                    dataResult={dataTrans}
                    dataInfo={dataInfo}
                    params={params}
                  />}
              </>

            </PDFViewer>
            // :
            // <div className="my-20 text-2xl text-bold">Account Active</div>
            :
            <div className='flex flex-col space-y-4 items-center justify-center text-xl rounded-lg bg-white shadow-md md:mt-10 p-6 font-semibold'>
              <span>{t("No Transcript data available")}</span>
              <span>{t("Check If All Student Profiles are Active")}</span>
              <span>{t("Or")}</span>
              <span>{t("Pending Patform Charge Payment")}</span>
            </div>
          }
        </div>
      </div>
    </DefaultLayout>
  );
};

export default List;