'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-p/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/components/Table/MyTableComp';
import MyModal from '@/MyModals/MyModal';
import ButtonAction from '@/Buttons/ButtonAction';
import { useTranslation } from 'react-i18next';
import { TableColumn } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { EdgeComplain } from '@/utils/Domain/schemas/interfaceGraphql';
import ModalCUDComplain from '@/components/MyModals/ModalCUDComplain';


const List = (
  { p, data, sp, apiComplainNames }:
    { p: any; data: EdgeComplain[], sp: any, apiComplainNames: string[] }
) => {

  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeComplain | null>(null);

  const trimmedData = data?.map((row) => ({
    ...row,
    node: {
      ...row.node,
      shortMessage: row.node.message?.length > 20
        ? row.node.message.slice(0, 100) + "..."
        : row.node.message,
      shortFullName: row.node.userprofile.customuser.fullName?.length > 20
        ? row.node.userprofile.customuser.fullName.slice(0, 15) + "..."
        : row.node.userprofile.customuser.fullName,
    },
  }));

  const Columns: TableColumn<EdgeComplain>[] = [
    { header: "#", align: "center", render: (_item: EdgeComplain, index: number) => index + 1, },
    { header: `${t("Student")}`, accessor: "node.shortFullName", align: "left", },
    { header: `${t("Message")}`, accessor: "node.shortMessage", align: "left", },
    { header: `${t("Type")}`, accessor: "node.complainType", align: "left" },
    // { header: `${t("Status")}`, accessor: "node.status", align: "left" },
    // { header: `${t("Ending At")}`, accessor: "node.endingAt", align: "left" },
    { header: `${t("Date")}`, accessor: "node.createdAt", align: "left" },
    // { header: `${t("Type")}`, accessor: "node.notificationType", align: "left" },

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
              data={trimmedData?.sort((a: EdgeComplain, b: EdgeComplain) => a.node.endingAt > b.node.endingAt ? 1 : a.node.endingAt < b.node.endingAt ? -1 : 0)}
              columns={Columns}
              table_title={t("Complains")}
              button_type={"add"}
              button_action={() => { setShowModal({ type: "create", show: true }) }}
            />
            :
            <ServerError type='network' item='' />}
        </div>


        <MyModal
          component={
            <ModalCUDComplain
              source={"admin"}
              params={p}
              setOpenModal={setShowModal}
              actionType={showModal?.type || "create"}
              selectedItem={showModal?.type === "create" ? null : selectedItem}
              apiComplainNames={apiComplainNames}
              section={"Higher"}
            />
          }
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

