'use client';

import React, { FC, useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration'; import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/components/Table/MyTableComp';
import { EdgeMainSubjectSec, TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyModal from '@/MyModals/MyModal';
import ButtonAction from '@/Buttons/ButtonAction';
import ModalCUDMainSubject from '@/components/MyModals/ModalCUDMainSubject';
import { useTranslation } from 'react-i18next';
import SearchMultiple from '@/components/Search/SearchMultiple';


const List = ({ p, data, sp }: { p: any; data: any, sp: any }) => {
  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeMainSubjectSec | null>(null);

  const Columns: TableColumn<EdgeMainSubjectSec>[] = [
    { header: "#", align: "center", render: (_item: EdgeMainSubjectSec, index: number) => index + 1, },
    { header: `${t("Subject Code")}`, accessor: "node.subjectCode", align: "left" },
    { header: `${t("Subject Name")}`, accessor: "node.subjectName", align: "left" },

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
      searchComponent={
        <SearchMultiple
          names={['subjectName', 'subjectCode']}
          link={`/${p.domain}/Section-S/pageAdministration/${p.school_id}/pageAcademics/pageMainSubjects`}
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


        <div className="bg-white mx-auto rounded shadow w-full">
          {data ?
            <MyTableComp
              data={
                data.sort((a: EdgeMainSubjectSec, b: EdgeMainSubjectSec) => {
                  const subjectNameA = a.node.subjectName;
                  const subjectNameB = b.node.subjectName;
                  const codeA = a.node.subjectCode.toLowerCase();
                  const codeB = b.node.subjectCode.toLowerCase();

                  if (subjectNameA > subjectNameB) return 1;
                  if (subjectNameA < subjectNameB) return -1;
                  // if (codeA > codeB) return 1;
                  // if (codeA < codeB) return -1;

                  return codeA.localeCompare(codeB);
                  // return subjectNameA.localeCompare(subjectNameB);
                })}
              columns={Columns}
              table_title={t("Subject List")}
              button_type={"add"}
              button_action={() => { setShowModal({ type: "create", show: true }) }}
            />
            :
            <ServerError type='network' item='' />}
        </div>


        <MyModal
          component={<ModalCUDMainSubject
            params={p}
            setOpenModal={setShowModal}
            actionType={showModal?.type || "create"}
            selectedItem={selectedItem}
            section={"Secondary"}
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

