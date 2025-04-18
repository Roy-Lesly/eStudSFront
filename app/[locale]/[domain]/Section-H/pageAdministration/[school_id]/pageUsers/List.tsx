'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { EdgeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import { useRouter } from 'next/navigation';
import { decodeUrlID } from '@/functions';
import MyTabs from '@/MyTabs';


export const metadata: Metadata = {
  title: "Users Page",
  description: "This is Users Page Admin Settings",
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

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);


  const Columns: TableColumn<EdgeCustomUser>[] = [
    {
      header: '#',
      align: 'left',
      render: (_item: EdgeCustomUser, index: number) => index + 1,
      responsiveHidden: true
    },
    {
      header: 'Full Name',
      accessor: 'node.fullName',
      align: 'left',
    },
    {
      header: 'Gender',
      accessor: 'node.sex',
      align: 'left',
      responsiveHidden: true
    },
    {
      header: 'Address',
      accessor: 'node.address',
      align: 'left',
      responsiveHidden: true
    },
    {
      header: 'Telephone',
      accessor: 'node.telephone',
      align: 'left',
      responsiveHidden: true
    },
    {
      header: 'Dob / Pob',
      align: 'left',
      responsiveHidden: true,
      hideColumn: activeTab !== 2,
      render: (item: EdgeCustomUser, index: number) => <div className='flex gap-2'>
        <span>{item.node.dob}</span>
        <span>{item.node.pob}</span>
      </div>,
    },
    // {
    //   header: 'Select',
    //   align: 'center',
    //   render: (item: EdgeCourse) => (
    //     <button
    //       onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/details/${decodeUrlID(item.node.id.toString())}?lec=${params.lecturer_id}&sem=${item.node.semester}&spec=${item.node.specialty.id}`)}
    //       className="bg-green-200 p-2 rounded-full"
    //     >
    //       <FaRightLong color="green" size={23} />
    //     </button>
    //   ),
    // },
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
      searchComponent={<SearchMultiple
        names={['fullName', 'telephone']}
        link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers`}
        select={[
          { type: 'select', name: 'sex', dataSelect: ['MALE', 'FEMALE'] },
          // {
          //   type: 'searchAndSelect',
          //   name: 'subject',
          //   dataSelect: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
          // },
        ]}
      />}
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
        department="Users"
        subRoute="List"
        pageName="Users"
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers`}
        subLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">

        {data ? (
          <MyTabs
            tabs={[
              { label: 'Admins', content: data.admins?.allCustomUsers?.edges.length ? <DataComp data={data.admins.allCustomUsers.edges} title="Admins" /> : <ServerError type="notFound" item="Admin Users" /> },
              { label: 'Lecturers', content: data.lects?.allCustomUsers?.edges.length ? <DataComp data={data.lects.allCustomUsers.edges} title="Lecturers" /> : <ServerError type="notFound" item="Lecturer Users" /> },
              { label: 'Students', content: data.studs?.allCustomUsers?.edges.length ? <DataComp data={data.studs.allCustomUsers.edges} title="Students" /> : <ServerError type="notFound" item="Student Users" /> },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ) : (
          <ServerError type="network" item="Users" />
        )}

      </div>
    </DefaultLayout >
  );
};

export default List;


