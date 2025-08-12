'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTabs from '@/MyTabs';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TransactionTotalsByDomain } from '@/Domain/schemas/interfaceGraphqlKPI';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { GetMenuAccounting } from '@/components/section-h/Sidebar/MenuAccounting';


export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "e-conneq School System. Main-Subject Page Admin Settings",
};

const List = ({ params, data, dataYears, searchParams }: { params: any; data: any, searchParams: any, dataYears: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);

  const ColumnsRegistration: TableColumn<TransactionTotalsByDomain>[] = [
    { header: "#", responsiveHidden: true, align: "center", render: (_item: TransactionTotalsByDomain, index: number) => index + 1, },
    { header: "Domain Name", accessor: "domainName", align: "left", },
    { header: "Students", responsiveHidden: true, accessor: "count", align: "center" },
    { header: "Total Reg", align: "right", render: (item: TransactionTotalsByDomain) => <span>{item.expectedRegistration.toLocaleString()}</span> },
    { header: "Paid Reg", align: "right", render: (item: TransactionTotalsByDomain) => <span>{item.registration.toLocaleString()}</span> },
    { header: "balance Reg", align: "right", render: (item: TransactionTotalsByDomain) => <span>{item.balanceRegistration.toLocaleString()}</span> },
  ];
  const ColumnsTuition: TableColumn<TransactionTotalsByDomain>[] = [
    { header: "#", responsiveHidden: true, align: "center", render: (_item: TransactionTotalsByDomain, index: number) => index + 1, },
    { header: "Domain Name", accessor: "domainName", align: "left" },
    { header: "Students", responsiveHidden: true, accessor: "count", align: "center" },
    { header: "Scholarship", responsiveHidden: true, accessor: "scholarship", align: "right" },
    { header: "Total Fees", align: "right", render: (item: TransactionTotalsByDomain) => <span>{item.expectedTuition.toLocaleString()}</span> },
    { header: "Paid Fees", align: "right", render: (item: TransactionTotalsByDomain) => <span>{item.tuition.toLocaleString()}</span> },
    { header: "balance Fees", align: "right", render: (item: TransactionTotalsByDomain) => <span>{item.balanceTuition.toLocaleString()}</span> },
  ];
  const ColumnsOthers: TableColumn<TransactionTotalsByDomain>[] = [
    { header: "#", responsiveHidden: true, align: "center", render: (_item: TransactionTotalsByDomain, index: number) => index + 1, },
    { header: "Domain Name", accessor: "domainName", align: "left" },
    { header: "Students", responsiveHidden: true, accessor: "count", align: "center" },
    { header: "Total. Platform", align: "right", render: (item: TransactionTotalsByDomain) => <span>{item.expectedPlatformCharges.toLocaleString()}</span> },
    // { header: "P. Platform", accessor: "platformCharges", align: "left" },
    // { header: "Tot. Platform", accessor: "expectedPlatformCharges", align: "left" },
    // { header: "P. Platform", accessor: "platformCharges", align: "left" },
  ];


  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={["academicYear"]}
          link={`/${params.domain}/Section-H/pageAccounting/${params.school_id}/AnalysisSystemIncomeDomain`}
          select={[
            // { type: 'select', name: 'academicYear', dataSelect: dataYears?.allAcademicYears },
          ]}
        />
      }
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
        pageName="Campus Income"
        mainLink={`${params.domain}/Section-H/pageAccounting/${params.school_id}/AnalysisSystemIncomeDomain`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">

          <div className='flex items-center justify-center'>
            {searchParams && searchParams?.academicYear ?
              <span className='font-semibold my-2 rounded text-xl'>{searchParams?.academicYear}</span>
              :
              <span className='font-medium my-24 p-4 rounded text-lg'>Please Select Academic Year</span>}
          </div>

          {data && !data?.error ? (
            <MyTabs
              tabs={[
                {
                  label: 'Registration', content: data?.transactionTotalsByDomain?.length ?
                    <MyTableComp
                      data={
                        data?.transactionTotalsByDomain?.sort((a: TransactionTotalsByDomain, b: TransactionTotalsByDomain) => {
                          return a.domainName > b.domainName ? 1 : a.domainName < b.domainName ? -1 : 0
                        })}
                      columns={ColumnsRegistration}
                    />
                    :
                    <ServerError type="notFound" item="Income" />
                },
                {
                  label: 'Tuition', content: data?.transactionTotalsByDomain?.length ?
                    <MyTableComp
                      data={
                        data?.transactionTotalsByDomain?.sort((a: TransactionTotalsByDomain, b: TransactionTotalsByDomain) => {
                          return a.domainName > b.domainName ? 1 : a.domainName < b.domainName ? -1 : 0
                        })}
                      columns={ColumnsTuition}
                    />
                    :
                    <ServerError type="notFound" item="Income" />
                },
                // {
                //   label: 'Others', content: data?.transactionTotalsByDomain?.length ?
                //         <MyTableComp
                //         data={
                //           data?.transactionTotalsByDomain?.sort((a: TransactionTotalsByDomain, b: TransactionTotalsByDomain) => {
                //             return a.domainName > b.domainName ? 1 : a.domainName < b.domainName ? -1 : 0
                //           })}
                //         columns={ColumnsOthers}
                //       />
                //     :
                //     <ServerError type="notFound" item="Income" />
                // },
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              source={"setActiveTab"}
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