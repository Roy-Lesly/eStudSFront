'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-p/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyModal from '@/MyModals/MyModal';
import ButtonAction from '@/Buttons/ButtonAction';
import { useTranslation } from 'react-i18next';
import { EdgeComplainPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import ModalCUDComplains from '@/components/MyModals/ModalCUDComplains';


const List = ({ p, data, sp, apiYears }: { p: any; data: EdgeComplainPrim[], sp: any, apiYears: string[] }) => {
  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeComplainPrim | null>(null);


  const Columns: TableColumn<EdgeComplainPrim>[] = [
    { header: "#", align: "center", render: (_item: EdgeComplainPrim, index: number) => index + 1, },
    { header: `${t("Message")}`, accessor: "node.message", align: "left" },
    { header: `${t("Type")}`, accessor: "node.complainType", align: "left" },
    { header: `${t("Status")}`, accessor: "node.status", align: "left" },
    { header: `${t("Ending Date")}`, accessor: "node.endingAt", align: "left" },
    // { header: `${t("Date")}`, align: "left", render: ((item: EdgeComplainPrim) => <div className='flex flex-col'>
    //   <span>{item.node.scheduledFor.slice(0, 10)}</span>
    //   <span>{item.node.scheduledFor.slice(11, 16)}</span>
    // </div>) },

    {
      header: "View", align: "center",
      render: (item) => <div className='flex flex-row gap-2 justify-center w-full'>
        <ButtonAction data={item} type='edit' action={() => { setShowModal({ show: true, type: "update" }); setSelectedItem(item) }} />
        <ButtonAction data={item} type='delete' action={() => { setShowModal({ show: true, type: "delete" }); setSelectedItem(item) }} />
      </div>,
    },
  ];

  console.log(data);

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
              data={data?.sort((a: EdgeComplainPrim, b: EdgeComplainPrim) => a.node.endingAt > b.node.endingAt ? 1 : a.node.endingAt < b.node.endingAt ? -1 : 0)}
              columns={Columns}
              table_title={t("Complains")}
              button_type={"add"}
              button_action={() => { setShowModal({ type: "create", show: true }) }}
            />
            :
            <ServerError type='network' item='' />}
        </div>


        <MyModal
          component={<ModalCUDComplains
            params={p}
            setOpenModal={setShowModal}
            actionType={showModal?.type || "create"}
            selectedItem={selectedItem}
            apiYears={apiYears}
            section={"Primary"}
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

