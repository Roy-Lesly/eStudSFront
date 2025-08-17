'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { EdgeCustomUser, NodeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import MyTabs from '@/MyTabs';
import ActivateUserModal from '@/ActivateUserModal';
import { decodeUrlID } from '@/functions';
import PasswordResetModal from '@/components/PasswordResetModal';
import { useTranslation } from 'react-i18next';


export const metadata: Metadata = {
  title: "Users Page",
  description: "e-conneq School System. Users Page Admin Settings",
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

const List = ({ p, data, sp }: { p: any; data: any, sp: any }) => {

  const { t } = useTranslation("common")
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"reset" | "change" | "activate" | null>(null);
  const [selectedItem, setSelectedItem] = useState<NodeCustomUser>();

  const [activeTab, setActiveTab] = useState(parseInt(sp?.tab) || 0);


  const Columns: TableColumn<EdgeCustomUser>[] = [
    { header: '#', align: 'left', render: (_item: EdgeCustomUser, index: number) => index + 1, responsiveHidden: true },
    { header: `${t('Username')}`, accessor: 'node.matricle', align: 'left', },
    { header: `${t('Full Name')}`, accessor: 'node.fullName', align: 'left', },
    { header: `${t('Gender')}`, accessor: 'node.sex', align: 'left', responsiveHidden: true },
    { header: `${t('Address')}`, accessor: 'node.address', align: 'left', responsiveHidden: true },
    { header: `${t('Telephone')}`, accessor: 'node.telephone', align: 'left', responsiveHidden: true },
    {
      header: `${t('Dob / Pob')}`,
      align: 'left',
      responsiveHidden: true,
      hideColumn: activeTab !== 2,
      render: (item: EdgeCustomUser, index: number) => <div className='flex gap-2'>
        <span>{item.node.dob}</span>
        <span>{item.node.pob}</span>
      </div>,
    },
    {
      header: `${t('Change')}`,
      align: 'center',
      render: (item: EdgeCustomUser) => (
        <div
          className="flex gap-2 flex-row w-full justify-between"
        >
          <button onClick={() => { setSelectedItem(item?.node); setActionType("change") }} className='text-white font-medium bg-green-600 rounded-xl px-2 py-1'>{t("Change")}</button>
          <button onClick={() => { setSelectedItem(item?.node); setActionType("reset") }} className='text-white font-medium bg-red rounded-xl px-2 py-1'>{t("Reset")}</button>
          <button onClick={() => { setSelectedItem(item?.node); setActionType("activate") }} className='bg-slate-600 text-white font-medium rounded-xl px-2 py-1'>{t("Status")}</button>
        </div>
      ),
    },
  ];

  const DataComp = ({ data, title }: { data: EdgeCustomUser[], title: string }) => {
    return <div className='flex flex-col gap-2 w-full'>
      <MyTableComp
        data={data}
        columns={Columns}
        rowKey={(item, index) => item.node.id || index}
      />

      {actionType != "activate" ? <PasswordResetModal
        action={actionType}
        onClose={() => setActionType(null)}
        id={parseInt(decodeUrlID(selectedItem?.id || ""))}
      /> : null}

      {/* <PasswordResetModal */}

      {actionType == "activate" ? <ActivateUserModal
        action={actionType}
        p={p}
        onClose={() => setActionType(null)}
        id={parseInt(decodeUrlID(selectedItem?.id || ""))}
        status={selectedItem?.isActive || false}
      /> : null}

    </div>
  }

  return (
    <DefaultLayout
      pageType='admin'
      domain={p.domain}
      searchComponent={<SearchMultiple
        names={['fullName', 'telephone']}
        link={`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUsers`}
        select={[
          { type: 'select', name: 'sex', dataSelect: ['MALE', 'FEMALE'] },
        ]}
      />}
      sidebar={
        <Sidebar
          params={p}
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
        department="Users"
        subRoute="List"
        pageName="Users"
        mainLink={`${p.domain}/Section-S/pageAdministration/${p.school_id}/pageUsers/pageStaff`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">

        {data ? (

          <MyTabs
            tabs={[
              { label: `${t('Admins')}`, content: data.admins?.allCustomusers?.edges.length ? <DataComp data={data.admins.allCustomusers.edges} title="Admins" /> : <ServerError type="notFound" item={t("Admin Users")} /> },
              { label: `${t('Lecturers')}`, content: data.lects?.allCustomusers?.edges.length ? <DataComp data={data.lects.allCustomusers.edges} title="Lecturers" /> : <ServerError type="notFound" item={t("Lecturer Users")} /> },
              // { label: `${t('Students')}`, content: data.studs?.allCustomusers?.edges.length ? <DataComp data={data.studs.allCustomusers.edges} title="Students" /> : <ServerError type="notFound" item={t("Student Users")} /> },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            source={`Section-S/pageAdministration/${p.school_id}/pageUsers/pageStaff?`}
          />
        ) : (
          <ServerError type="network" item="Staff Management" />
        )}


      </div>
    </DefaultLayout >
  );
};

export default List;


