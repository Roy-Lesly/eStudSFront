'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { EdgeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import MyTabs from '@/MyTabs';
import { FaPlus } from 'react-icons/fa';
import CreateLecturer from './CreateLecturerModal';
import { FaRightLong } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';


export const metadata: Metadata = {
  title: "Teachers Page",
  description: "e-conneq School System. Teachers Page Admin Settings",
};


export const parseJson = (data: string | Record<string, boolean>): Record<string, boolean> => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }
  return data;
};

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {

  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(parseInt(searchParams?.tab) || 0);
  const [selectedItem, setSelectedItem] = useState<EdgeCustomUser | null>(null);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "admin" | "teacher" }>();

  const Columns: TableColumn<EdgeCustomUser>[] = [
    {
      header: '#',
      align: 'left',
      render: (_item: EdgeCustomUser, index: number) => index + 1,
      responsiveHidden: true
    },
    {
      header: `${t("Username")}`,
      accessor: 'node.matricle',
      align: 'left',
    },
    {
      header: `${t("Full Name")}`,
      accessor: 'node.fullName',
      align: 'left',
    },
    {
      header: `${t("Gender")}`,
      accessor: 'node.sex',
      align: 'center',
      responsiveHidden: true
    },
    {
      header: `${t("Address")}`,
      accessor: 'node.address',
      align: 'left',
      responsiveHidden: true
    },
    {
      header: `${t("Telephone")}`,
      accessor: 'node.telephone',
      align: 'center',
      responsiveHidden: true
    },
    {
      header: `${t("Dob / Pob")}`,
      align: 'left',
      responsiveHidden: true,
      hideColumn: activeTab !== 2,
      render: (item: EdgeCustomUser, index: number) => <div className='flex gap-2'>
        <span>{item.node.dob}</span>
        <span>{item.node.pob}</span>
      </div>,
    },
    {
      header: `${t("Select")}`,
      align: 'center',
      render: (item: EdgeCustomUser) => (
        <button
          onClick={() => { setShowModal({ type: activeTab === 0 ? "admin" : "teacher", show: true }); setSelectedItem(item) }}
          className="bg-green-200 p-2 rounded-full"
        >
          <FaRightLong color="green" size={23} />
        </button>
      ),
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
      searchComponent={<SearchMultiple
        names={['fullName', 'telephone']}
        link={`/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageLecturers`}
        select={[
          { type: 'select', name: 'sex', dataSelect: ['MALE', 'FEMALE'] },
        ]}
      />}
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

        {data ? (
          <MyTabs
            tabs={[
              {
                label: `${t("Admins")}`,
                icon: <div className='bg-teal-500 p-2 rounded-full' onClick={() => { setShowModal({ show: true, type: "admin" }) }}><FaPlus color="white" size={20} /></div>,
                content: data.admins?.allCustomusers?.edges.length ? <DataComp data={data.admins.allCustomusers.edges} title="Admins" /> : <ServerError type="notFound" item="Admin Users" />
              },
              {
                label: `${t("Teachers")}`,
                icon: <div className='bg-teal-500 p-2 rounded-full' onClick={() => { setShowModal({ show: true, type: "teacher" }) }}><FaPlus color="white" size={20} /></div>,
                content: data.lects?.allCustomusers?.edges.length ? <DataComp data={data.lects.allCustomusers.edges} title="Lecturers" /> : <ServerError type="notFound" item="Teachers Users" />
              },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            source={`Section-P/pageAdministration/${params.school_id}/pageLecturers/?`}
          />
        ) : (
          <ServerError type="network" item="Users" />
        )}


        {showModal && showModal.show ?
          <CreateLecturer
            params={params}
            openModal={showModal.show}
            setOpenModal={setShowModal}
            role={showModal.type}
            actionType={selectedItem ? "update" : "create"}
            selectedItem={selectedItem}
            depts={data?.lects?.allDepartments?.edges}
          />
          :
          null}

      </div>
    </DefaultLayout >
  );
};

export default List;


