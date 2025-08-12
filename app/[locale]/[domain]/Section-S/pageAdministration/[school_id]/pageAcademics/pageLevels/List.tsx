'use client';

import React, { FC, useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { EdgeLevel } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ModalCUDLevel from '@/MyModals/ModalCUDLevel';
import MyModal from '@/MyModals/MyModal';
import ButtonAction from '@/section-h/Buttons/ButtonAction';


export const metadata: Metadata = {
  title: "Levels Page",
  description: "e-conneq School System. Levels Page Admin Settings",
};

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeLevel | null>(null);


  const Columns: TableColumn<EdgeLevel>[] = [
    { header: "#", align: "center", render: (_item: EdgeLevel, index: number) => index + 1, },
    { header: "Level", accessor: "node.level", align: "left" },

    {
      header: "View", align: "center",
      render: (item) => <div className='flex flex-row gap-2 justify-center w-full'>
        <ButtonAction data={item} type='edit' action={() => { setShowModal({ show: true, type: "update" }); setSelectedItem(item) }} />
        <ButtonAction data={item} type='delete' action={() => { setShowModal({ show: true, type: "delete" }); setSelectedItem(item) }} />
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
        department="Levels"
        subRoute="List"
        pageName="Levels"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Levels`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ?
            data.allLevels.edges.length ?
              <MyTableComp
                data={data.allLevels.edges.sort((a: EdgeLevel, b: EdgeLevel) => a.node.level > b.node.level ? 1 : a.node.level < b.node.level ? -1 : 0)}
                columns={Columns}
                table_title='Level'
                button_type={"add"}
                button_action={() => { setShowModal({ type: "create", show: true }) }}
              />
              :
              <ServerError type='notFound' item='SchoolInfo' />
            :
            <ServerError type='network' item='' />}
        </div>


        <MyModal
          component={<ModalCUDLevel
            params={params}
            setOpenModal={setShowModal}
            actionType={showModal?.type || "create"}
            selectedItem={selectedItem}
          />}
          openState={showModal?.show || false}
          onClose={() => setShowModal({ show: false, type: "create" })}
          title={showModal?.type || ""}
          classname=''
        />



      </div>
    </DefaultLayout>
  );
};

export default List;

