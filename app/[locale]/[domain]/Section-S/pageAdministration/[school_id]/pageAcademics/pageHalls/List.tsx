'use client';

import React, { FC, useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration'; import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/components/Table/MyTableComp';
import { EdgeMainSubject, TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyModal from '@/MyModals/MyModal';
import ButtonAction from '@/Buttons/ButtonAction';
import ModalCUDMainSubject from '@/components/MyModals/ModalCUDMainSubject';
import { useTranslation } from 'react-i18next';
import { EdgeHall } from '@/utils/Domain/schemas/interfaceGraphql';
import ModalCUDHall from '@/components/MyModals/ModalCUDHall';


const List = ({ p, data, sp }: { p: any; data: any, sp: any }) => {
  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeHall | null>(null);


  const Columns: TableColumn<EdgeHall>[] = [
    { header: "#", align: "center", render: (_item: EdgeHall, index: number) => index + 1, },
    { header: `${t("Hall Name")}`, accessor: "node.name", align: "left" },
    { header: `${t("Capacity")}`, accessor: "node.capacity", align: "left" },
    { header: `${t("Floor")}`, accessor: "node.floor", align: "left" },

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
      domain={p.domain}
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
      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ?
            <MyTableComp
              data={data.sort((a: EdgeHall, b: EdgeHall) => a.node.floor > b.node.floor ? 1 : a.node.floor < b.node.floor ? -1 : 0)}
              columns={Columns}
              table_title={t("Classroom Halls")}
              button_type={"add"}
              button_action={() => { setShowModal({ type: "create", show: true }) }}
            />
            :
            <ServerError type='network' item='' />}
        </div>


        <MyModal
          component={<ModalCUDHall
            params={p}
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

