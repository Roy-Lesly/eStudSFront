'use client';

import React, { FC, useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { EdgeProgram } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyModal from '@/MyModals/MyModal';
import ModalCUDProgram from '@/MyModals/ModalCUDProgram';
import ButtonAction from '@/section-h/Buttons/ButtonAction';


export const metadata: Metadata = {
  title: "Levels Page",
  description: "e-conneq School System. Levels Page Admin Settings",
};

const List = ({ params, data }: { params: any; data: any, searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeProgram | null>(null);


  const Columns: TableColumn<EdgeProgram>[] = [
    { header: "#", align: "center", render: (_item: EdgeProgram, index: number) => index + 1, },
    { header: "Program", accessor: "node.name", align: "left" },
    { header: "Description", accessor: "node.description", align: "left" },

    {
      header: "View", align: "center",
      render: (item) => <div className='flex flex-row gap-2 justify-center'>
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
      <div className="bg-gray-50 flex flex-col items-center justify-center">

        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ?
            <MyTableComp
              data={data.allPrograms.edges.sort((a: EdgeProgram, b: EdgeProgram) => a.node.name > b.node.name ? 1 : a.node.name < b.node.name ? -1 : 0)}
              columns={Columns}
              table_title='Program'
              button_type={"add"}
              button_action={() => { setShowModal({ type: "create", show: true }) }}
            />
            :
            <ServerError type='network' item='' />}
        </div>



        <MyModal
          component={<ModalCUDProgram
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

