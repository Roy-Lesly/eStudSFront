'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import SearchMultiple from '@/Search/SearchMultiple';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTabs from '@/MyTabs';
import MyTableComp from '@/components/Table/MyTableComp';
import { TransactionTotalsBySpecialty } from '@/Domain/schemas/interfaceGraphqlKPI';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { EdgeLevel } from '@/Domain/schemas/interfaceGraphql';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { GetMenuAccounting } from '@/components/section-h/Sidebar/MenuAccounting';
import { useTranslation } from 'react-i18next';


export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "e-conneq School System. Main-Subject Page Admin Settings",
};

const List = ({ p, data, dataYears, dataLevels, sp }: { p: any; data: any, sp: any, dataYears: any, dataLevels: EdgeLevel[] }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(parseInt(sp?.tab) || 0);

  const ColumnsRegistration: TableColumn<TransactionTotalsBySpecialty>[] = [
    { header: "#", align: "center", responsiveHidden: true, render: (_item: TransactionTotalsBySpecialty, index: number) => index + 1, },
    { header: "Specialty Name", accessor: "specialtyName", align: "left" },
    { header: "Level", accessor: "level", align: "center" },

    { header: "Students", responsiveHidden: true, accessor: "count", align: "center", },
    { header: "Total Reg", align: "right", render: (item: TransactionTotalsBySpecialty) => <span>{item.expectedRegistration.toLocaleString()}</span> },
    { header: "Paid Reg", align: "right", render: (item: TransactionTotalsBySpecialty) => <span>{item.registration.toLocaleString()}</span> },
    { header: "balance Reg", align: "right", render: (item: TransactionTotalsBySpecialty) => <span>{item.balanceRegistration.toLocaleString()}</span> },
    {
      header: "View", align: "center",
      render: (item) => <div
        className="flex flex-row gap-2 items-center justify-center p-1 rounded-full"
      >
        <div className='flex flex-row gap-2'>
          <button
            onClick={() => router.push(`/${p.domain}/Section-H/pageAccounting/${p.school_id}/AnalysisSystemIncomeSpecialty/${item.specialtyId}`)}
            className="bg-green-200 p-1 rounded-full"
          >
            <FaRightLong color="green" size={21} />
          </button>
        </div>
      </div>
    },
  ];

  const ColumnsTuition: TableColumn<TransactionTotalsBySpecialty>[] = [
    { header: "#", responsiveHidden: true, align: "center", render: (_item: TransactionTotalsBySpecialty, index: number) => index + 1, },
    { header: "Specialty Name", accessor: "specialtyName", align: "left" },
    { header: "Level", accessor: "level", align: "center" },
    { header: "Students", responsiveHidden: true, accessor: "count", align: "center" },
    { header: "Scholarship", responsiveHidden: true, align: "right", render: (item: TransactionTotalsBySpecialty) => <span>{item.scholarship.toLocaleString()}</span> },
    { header: "Total Fees", align: "right", render: (item: TransactionTotalsBySpecialty) => <span>{item.expectedTuition.toLocaleString()}</span> },
    { header: "Paid Fees", align: "right", render: (item: TransactionTotalsBySpecialty) => <span>{item.tuition.toLocaleString()}</span> },
    { header: "Balance Fees", align: "right", render: (item: TransactionTotalsBySpecialty) => <span>{item.balanceTuition.toLocaleString()}</span> },
    {
      header: "View", align: "center",
      render: (item) => <div
        className="flex flex-row gap-2 items-center justify-center p-1 rounded-full"
      >
        <div className='flex flex-row gap-2'>
          <button
            onClick={() => router.push(`/${p.domain}/Section-H/pageAccounting/${p.school_id}/AnalysisSystemIncomeSpecialty/${item.specialtyId}`)}
            className="bg-green-200 p-1 rounded-full"
          >
            <FaRightLong color="green" size={21} />
          </button>
        </div>
      </div>
    },
  ];

  const ColumnsOthers: TableColumn<TransactionTotalsBySpecialty>[] = [
    { header: "#", align: "center", render: (_item: TransactionTotalsBySpecialty, index: number) => index + 1, },
    { header: "Specialty Name", accessor: "specialtyName", align: "left" },
    { header: "Level", accessor: "level", align: "left" },
    { header: "Students", accessor: "count", align: "center" },
    { header: "Total. Platform", align: "right", render: (item: TransactionTotalsBySpecialty) => <span>{item.expectedPlatformCharges.toLocaleString()}</span> },
    {
      header: "View", align: "center",
      render: (item) => <div
        className="flex flex-row gap-2 items-center justify-center p-1 rounded-full"
      >
        <div className='flex flex-row gap-2'>
          <button
            onClick={() => router.push(`/${p.domain}/Section-H/pageAccounting/${p.school_id}/AnalysisSystemIncomeSpecialty/${item.specialtyId}`)}
            className="bg-green-200 p-1 rounded-full"
          >
            <FaRightLong color="green" size={21} />
          </button>
        </div>
      </div>
    },
  ];


  return (
    <DefaultLayout
      pageType='admin'
      domain={p.domain}
      searchComponent={
        <SearchMultiple
          names={["academicYear", "level", "specialtyName"]}
          link={`/${p.domain}/Section-H/pageAccounting/${p.school_id}/AnalysisSystemIncomeSpecialty`}
          select={[
            { type: 'select', name: 'academicYear', dataSelect: dataYears },
            // { type: 'select', name: 'level', dataSelect: dataLevels.map((item: EdgeLevel) => item.node.level) },
          ]}
        />
      }
      sidebar={
        <Sidebar
          params={p}
          menuGroups={GetMenuAccounting()}
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
        department="Income"
        subRoute="List"
        pageName={t("Summary Income per Specialty")}
        mainLink={`${p.domain}/Section-H/pageAccounting/${p.school_id}/AnalysisSystemIncomeSpecialty`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          <div className='flex items-center justify-center'>
            {sp && sp?.academicYear ?
              <span className='font-semibold my-2 rounded text-xl'>{sp?.academicYear}</span>
              :
              <span className='font-medium my-24 p-4 rounded text-lg'>Please Select Academic Year</span>}
          </div>

          {data && !data?.error ? (
            <MyTabs
              tabs={[
                {
                  label: 'Registration', content: data?.transactionTotalsBySpecialty?.length ?
                    <MyTableComp
                      data={
                        data?.transactionTotalsBySpecialty?.sort((a: TransactionTotalsBySpecialty, b: TransactionTotalsBySpecialty) => {
                          return a.specialtyName > b.specialtyName ? 1 : a.specialtyName < b.specialtyName ? -1 : 0
                        })}
                      columns={ColumnsRegistration}
                    />
                    :
                    <ServerError type="notFound" item="Income" />
                },
                {
                  label: 'Tuition', content: data?.transactionTotalsBySpecialty?.length ?
                    <MyTableComp
                      data={
                        data?.transactionTotalsBySpecialty?.sort((a: TransactionTotalsBySpecialty, b: TransactionTotalsBySpecialty) => {
                          return a.specialtyName > b.specialtyName ? 1 : a.specialtyName < b.specialtyName ? -1 : 0
                        })}
                      columns={ColumnsTuition}
                    />
                    :
                    <ServerError type="notFound" item="Income" />
                },
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              source={`Section-H/pageAccounting/${p.school_id}/AnalysisSystemIncomeSpecialty/?academicYear=${sp.academicYear}`}
            />
          )
            :
            <>
              {data?.error && data?.error === "Not Authenticated" ? <ServerError type="authentication" item="Courses" /> : null}
              {data?.error && data?.error === "Not Authenticated" ? <ServerError type="network" item="Courses" /> : null}
            </>
          }
        </div>

      </div>
    </DefaultLayout>
  );
};

export default List;