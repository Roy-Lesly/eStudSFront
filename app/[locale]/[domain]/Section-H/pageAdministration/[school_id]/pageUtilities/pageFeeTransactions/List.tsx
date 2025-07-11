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
import MyTableComp from '@/section-h/Table/MyTableComp';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import ServerError from '@/ServerError';
import { useTranslation } from 'react-i18next';


export const metadata: Metadata = {
  title: "Transactions Page",
  description: "This is Transactions Section",
};

const List = ({ params, data }: { data: any, params: any; searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { t } = useTranslation("common")

    const Columns: TableColumn<EdgeTransactions>[] = [
      { header: '#', align: 'left', render: (_item: EdgeTransactions, index: number) => index + 1, responsiveHidden: true},
      { header: `${t('Full Name')}`, accessor: 'node.schoolfees.userprofile.customuser.fullName', align: 'left',},
      { header: `${t('Specialy and Level')}`, align: 'left', render: (_item: EdgeTransactions, index: number) => {
        return <div className='flex justify-between items-center gap-2'>
          <span className='w-full'>{_item.node.schoolfees.userprofile.specialty.mainSpecialty?.specialtyName}</span>
          <span className=''>{_item.node.schoolfees?.userprofile?.specialty?.level.level}</span>
        </div>
      }},
      { header: `${t('Amount')}`, align: 'right', render: (_item: EdgeTransactions, index: number) => _item.node.amount.toLocaleString()},
      { header: `${t('Purpose')}`, align: 'right', render: (_item: EdgeTransactions, index: number) => _item.node.reason},
      { header: `${t('Date')}`, align: 'center', render: (_item: EdgeTransactions, index: number) => _item.node.createdAt.slice(0, 10), responsiveHidden: true},
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

      <div className="bg-gray-50 flex flex-col items-center justify-center">
        {data?.allTransactions?.edges.length ? 
        <MyTableComp 
          data={data?.allTransactions?.edges}
          columns={Columns}
          table_title={t("Recent Financial Transactions")}
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