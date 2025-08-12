'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-p/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
// import MyModal from '@/MyModals/MyModal';
import ButtonAction from '@/section-h/Buttons/ButtonAction';
import { useTranslation } from 'react-i18next';
import { EdgeNotificationPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
// import ModalCUDNotification from '@/components/MyModals/ModalCUDNotification';


const List = (
  { p, data, sp, apiYears, apiTarget, apiLevels }:
  { p: any; data: EdgeNotificationPrim[], sp: any, apiYears: string[], apiTarget: string[], apiLevels: string[] }
) => {

  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeNotificationPrim | null>(null);


  const Columns: TableColumn<EdgeNotificationPrim>[] = [
    { header: "#", align: "center", render: (_item: EdgeNotificationPrim, index: number) => index + 1, },
    { header: `${t("Subject")}`, accessor: "node.subject", align: "left" },
    { header: `${t("Message")}`, accessor: "node.message", align: "left" },
    { header: `${t("Recipients")}`, accessor: "node.recipients", align: "left" },
    { header: `${t("Year")}`, accessor: "node.academicYear", align: "left" },
    { header: `${t("Date")}`, align: "left", render: ((item: EdgeNotificationPrim) => <div className='flex flex-col'>
      <span>{item.node.scheduledFor.slice(0, 10)}</span>
      <span>{item.node.scheduledFor.slice(11, 16)}</span>
    </div>) },
    { header: `${t("Type")}`, accessor: "node.notificationType", align: "left" },

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
              data={data?.sort((a: EdgeNotificationPrim, b: EdgeNotificationPrim) => a.node.academicYear > b.node.academicYear ? 1 : a.node.academicYear < b.node.academicYear ? -1 : 0)}
              columns={Columns}
              table_title={t("Announcements")}
              button_type={"add"}
              button_action={() => { setShowModal({ type: "create", show: true }) }}
            />
            :
            <ServerError type='network' item='' />}
        </div>


        {/* <MyModal
          component={<ModalCUDNotification
            params={p}
            setOpenModal={setShowModal}
            actionType={showModal?.type || "create"}
            selectedItem={selectedItem}
            apiYears={apiYears}
            section={"Primary"}
            apiTarget={apiTarget}
            apiLevels={apiLevels}
          />}
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

