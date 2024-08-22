'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/DefaultLayout';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import { EdgeTransactions } from '@/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/components/Table/MyTableComp';
import SearchMultiple from '@/Search/SearchMultiple';
import ServerError from '@/ServerError';


export const metadata: Metadata = {
  title: "Transactions Page",
  description: "e-conneq School System. Transactions Section",
};

const List = ({ params, data }: { data: any, params: any; searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const Columns: TableColumn<EdgeTransactions>[] = [
    { header: '#', align: 'left', render: (_item: EdgeTransactions, index: number) => index + 1, responsiveHidden: true },
    { header: 'Full Name', accessor: 'node.schoolfees.userprofile.customuser.fullName', align: 'left', },
    {
      header: 'Specialy', align: 'left', render: (_item: EdgeTransactions, index: number) => {
        return <div className='flex justify-between items-center gap-2'>
          <span className='w-full'>{_item.node.schoolfees.userprofile.specialty.mainSpecialty?.specialtyName}</span>
          <span className=''>{_item.node.schoolfees?.userprofile?.specialty?.level.level}</span>
        </div>
      }
    },
    { header: 'Amount', align: 'right', render: (_item: EdgeTransactions, index: number) => _item.node.amount.toLocaleString() },
    { header: 'Purpose', align: 'right', render: (_item: EdgeTransactions, index: number) => _item.node.reason },
    { header: 'Date', align: 'center', render: (_item: EdgeTransactions, index: number) => _item.node.createdAt.slice(0, 10), responsiveHidden: true },
  ]
  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={['fullName', 'specialtyName', 'level', 'academicYear']}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pageFeeTransactions`}
        />
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
        department="Fees"
        subRoute="List"
        pageName="Fee Transactions"
        mainLink=""
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">
        {data?.allTransactions?.edges.length ? <MyTableComp
          data={data?.allTransactions?.edges}
          columns={Columns}
        />
          :
          <ServerError
            item="Transactions"
            type='notFound'
          />
        }

      </div>
    </DefaultLayout>
  );
};

export default List;