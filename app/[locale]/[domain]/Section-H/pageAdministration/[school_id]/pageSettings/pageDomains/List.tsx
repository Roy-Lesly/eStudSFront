'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/DefaultLayout';
import { EdgeDomain } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ButtonAction from '@/section-h/Buttons/ButtonAction';
import ModalCUDDomain from '@/MyModals/ModalCUDDomain';
import MyModal from '@/MyModals/MyModal';
import ServerError from '@/ServerError';


export const metadata: Metadata = {
  title: "Domains Page",
  description: "This is Domains Page Admin Settings",
};

const List = ({ params, data }: { params: any; data: any, searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeDomain | null>(null);


  const Columns: TableColumn<EdgeDomain>[] = [
    { header: "#", align: "center", render: (_item: EdgeDomain, index: number) => index + 1, },
    { header: "Domain Name", accessor: "node.domainName", align: "left" },

    {
      header: "View", align: "center", render: (item) => <div className='flex flex-row gap-2 justify-center'>
      <ButtonAction data={item} type='edit' action={() => {setShowModal({ show: true, type: "update"}); setSelectedItem(item) }} />
      <ButtonAction data={item} type='delete' action={() => {setShowModal({ show: true, type: "delete"}); setSelectedItem(item) }} />
    </div>,
    },
  ];
  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
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
        department="Domains"
        subRoute="List"
        pageName="Domains"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/${params.profile_id}`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/${params.profile_id}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ?
            data.allDomains.edges.length ?
              <MyTableComp
                data={
                  data.allDomains.edges.sort((a: EdgeDomain, b: EdgeDomain) => {
                    const domainNameA = a.node.domainName.toLowerCase();
                    const domainNameB = b.node.domainName.toLowerCase();
                    return domainNameA.localeCompare(domainNameB);
                  })}
                columns={Columns}
                table_title='Domains'
                button_type={"add"}
                button_action={() => { setShowModal({ type: "create", show: true })}}
              />
              :
              <ServerError type='notFound' item='SchoolInfo' />
            :
            <ServerError type='network' item='' />}
        </div>

        <MyModal
          component={<ModalCUDDomain
            params={params}
            setOpenModal={setShowModal}
            actionType={showModal?.type || "create"}
            selectedItem={selectedItem}
          />}
          openState={showModal?.show || false}
          onClose={() => setShowModal({ show: false, type: "create"})}
          title={showModal?.type || ""}
          classname=''
        />

      </div>
    </DefaultLayout>
  );
};

export default List;

