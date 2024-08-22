'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import SearchMultiple from '@/Search/SearchMultiple';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/components/Table/MyTableComp';
import { EdgeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import { useRouter } from 'next/navigation';
import { decodeUrlID } from '@/functions';
import MyTabs from '@/MyTabs';


export const metadata: Metadata = {
  title: "Duplicates Page",
  description: "e-conneq School System. Duplicates Page Admin Settings",
};


export const parseJson = (data: string | Record<string, boolean>): Record<string, boolean> => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return {};
    }
  }
  return data;
};

const List = ({ params, data, searchParams }: { params: any; data: EdgeCustomUser[], searchParams: any }) => {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);


  const Columns: TableColumn<EdgeCustomUser>[] = [
    { header: '#', align: 'left', render: (_item: EdgeCustomUser, index: number) => index + 1, responsiveHidden: true },
    { header: 'Full Name', accessor: 'node.fullName', align: 'left', },
    { header: 'Gender', accessor: 'node.sex', align: 'left', responsiveHidden: true },
    { header: 'Address', accessor: 'node.address', align: 'left', responsiveHidden: true },
    { header: 'Telephone', accessor: 'node.telephone', align: 'left', responsiveHidden: true },
    {
      header: 'Dob / Pob', align: 'left', responsiveHidden: true,
      render: (item: EdgeCustomUser, index: number) => <div className='flex gap-2'>
        <span>{item.node.dob}</span>
        <span>{item.node.pob}</span>
      </div>,
    },
    {
      header: 'Date', align: 'left', responsiveHidden: true,
      render: (item: EdgeCustomUser) => <div className='flex gap-2'>
        <span>{item.node.createdAt?.slice(0, 10)}</span>
      </div>,
    },
  ];

  const DataComp = ({ data, title }: { data: any, title: string }) => {
    return <div className='flex flex-col gap-2 w-full'>
      <MyTableComp
        data={data}
        columns={Columns}
        rowKey={(item, index) => item.node.id || index}
      />
    </div>
  }

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={<></>}
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
        department="Duplicate Users"
        subRoute="List"
        pageName="Duplicate Users"
        mainLink=""
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">

        {data ?
          <DataComp
            data={data}
            title=''
          />
          :
          <ServerError type="network" item="Duplicate Users" />
        }

      </div>
    </DefaultLayout >
  );
};

export default List;


