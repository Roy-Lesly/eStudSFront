'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-p/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/section-h/Table/MyTableComp';
import MyModal from '@/MyModals/MyModal';
import ButtonAction from '@/section-h/Buttons/ButtonAction';
import { useTranslation } from 'react-i18next';
// import ModalCUDNotification from '@/components/MyModals/ModalCUDNotification';
import { EdgeLevel, EdgeNotification } from '@/utils/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';


const List = (
  { p, data, sp, apiYears, apiTarget, apiLevels }:
    { p: any; data: EdgeNotification[], sp: any, apiYears: string[], apiTarget: string[], apiLevels: EdgeLevel[] }
) => {

  console.log(apiTarget);
  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeNotification | null>(null);


  const trimmedData = data?.map((row) => ({
    ...row,
    node: {
      ...row.node,
      shortSubject: row.node.subject?.length > 20
        ? row.node.subject.slice(0, 20) + "..."
        : row.node.subject,
      shortMessage: row.node.message?.length > 20
        ? row.node.message.slice(0, 20) + "..."
        : row.node.message,
    },
  }));

  const Columns: TableColumn<EdgeNotification>[] = [
    { header: "#", align: "center", render: (_item: EdgeNotification, index: number) => index + 1, },
    { header: `${t("Subject")}`, accessor: "node.shortSubject", align: "left" },
    { header: `${t("Message")}`, accessor: "node.shortMessage", align: "left", },
    { header: `${t("Recipients")}`, accessor: "node.recipients", align: "left" },
    { header: `${t("Year")}`, accessor: "node.academicYear", align: "left" },
    {
      header: `${t("Date")}`, align: "left", render: ((item: EdgeNotification) => <div className='flex flex-col'>
        <span>{item.node.scheduledFor.slice(0, 10)}</span>
        {/* <span>{item.node.scheduledFor.slice(11, 16)}</span> */}
      </div>)
    },
    // { header: `${t("Type")}`, accessor: "node.notificationType", align: "left" },

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
              data={trimmedData?.sort((a: EdgeNotification, b: EdgeNotification) => a.node.academicYear > b.node.academicYear ? 1 : a.node.academicYear < b.node.academicYear ? -1 : 0)}
              columns={Columns}
              table_title={t("Announcements")}
              button_type={"add"}
              button_action={() => { setShowModal({ type: "create", show: true }) }}
            />
            :
            <ServerError type='network' item='' />}
        </div>


        {/* <MyModal
          component={
            <ModalCUDNotification
              params={p}
              setOpenModal={setShowModal}
              actionType={showModal?.type || "create"}
              selectedItem={showModal?.type === "create" ? null : selectedItem}
              apiYears={apiYears}
              apiTarget={apiTarget}
              apiLevels={apiLevels}
              section={"Higher"}
            />
          }
          openState={showModal?.show || false}
          onClose={() => setShowModal({ show: false, type: "create" })}
          title={showModal?.type || ""}
          classname=''
        /> */}


      </div>
    </DefaultLayout>
  );
};

export default List;

