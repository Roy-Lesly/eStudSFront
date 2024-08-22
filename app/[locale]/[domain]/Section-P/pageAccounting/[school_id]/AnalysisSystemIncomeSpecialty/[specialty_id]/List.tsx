'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/components/Table/MyTableComp';
import { TransactionTotalsByStudent } from '@/Domain/schemas/interfaceGraphqlKPI';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ExcelExporter from '@/ExcelExporter';
import { GetMenuAccounting } from '@/components/section-h/Sidebar/MenuAccounting';

export const metadata: Metadata = {
  title: "Student Acount Details",
  description: "e-conneq School System. Student Acount Details Page",
};

const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const Columns: TableColumn<TransactionTotalsByStudent>[] = [
    { header: "#", align: "center", responsiveHidden: true, render: (_item: TransactionTotalsByStudent, index: number) => index + 1, },
    { header: "Student Name", accessor: "fullName", align: "left" },
    { header: "Registration", align: "right", render: (item: TransactionTotalsByStudent) => <span>{item.registration?.toLocaleString()}</span> },
    { header: "Tuition", align: "right", render: (item: TransactionTotalsByStudent) => <span>{item.tuition?.toLocaleString()}</span> },
    { header: "Scholarship", align: "right", render: (item: TransactionTotalsByStudent) => <span>{item.scholarship?.toLocaleString()}</span> },
    { header: "Balance", align: "right", render: (item: TransactionTotalsByStudent) => <span>{item.balance?.toLocaleString()}</span> },
  ];

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      // downloadComponent={<ExcelExporter
      //   data={data}
      //   title={"Payment-" + data && data?.length ? data[0]?.specialtyName + " " + data[0]?.academicYear + " " + data[0]?.level.toString() : ""}
      //   type={"Payment"}
      //   page={"list_payment_students"}
      // />}
      searchComponent={<></>}
      sidebar={
        <Sidebar
          params={params}
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
        pageName={`FINANCE for ${data && data?.length ? data[0]?.specialtyName + " " + data[0]?.academicYear + " " + data[0]?.level.toString() : null}`}
        mainLink={`${params.domain}/Section-H/pageAccounting/${params.school_id}/AnalysisSystemIncomeSpecialty`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">

          <div className='flex items-center justify-center'>

          </div>

          {data && data?.length ? (
            <MyTableComp
              data={
                data?.sort((a: TransactionTotalsByStudent, b: TransactionTotalsByStudent) => {
                  return a.fullName > b.fullName ? 1 : a.fullName < b.fullName ? -1 : 0
                })}
              columns={Columns}
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