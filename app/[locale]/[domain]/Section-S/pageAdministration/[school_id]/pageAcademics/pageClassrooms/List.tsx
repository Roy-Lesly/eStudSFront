'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import { EdgeClassRoomSec, TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import SearchMultiple from '@/Search/SearchMultiple';
import ExcelExporter from '@/ExcelExporter';
import ButtonAction from '@/Buttons/ButtonAction';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import MyModal from '@/MyModals/MyModal';
import { useTranslation } from 'react-i18next';
import ModalCUDClassroomSec from '@/components/MyModals/ModalCUDClassroomSec';
import MyTableComp from '@/components/Table/MyTableComp';


const List = (
  { params, data, sp, apiLevel, apiClassType }:
  { params: any; data: any, sp: any, apiLevel: any, apiClassType: any }
) => {

  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeClassRoomSec | null>(null);
  const router = useRouter();

  const Columns: TableColumn<EdgeClassRoomSec>[] = [
    { header: "#", align: "center", render: (_item: EdgeClassRoomSec, index: number) => index + 1, },
    { header: `${t("Class")}`, align: "left", render: (item: EdgeClassRoomSec) => <div className='flex justify-between gap-2 items-center'>
      <span className='w-full'>{item?.node?.level}</span>
      <span>{item?.node?.classType}</span>
      <span></span>
    </div> },
    { header: `${t("Series")}`, accessor: "node.series.name", align: "left" },
    { header: `${t("Section")}`, accessor: "node.stream", align: "center" },
    { header: `${t("Year")}`, accessor: "node.academicYear", align: "center" },
    { header: `${t("Fees")}`, accessor: "node.tuition", align: "center" },
    { header: `${t("Students")}`, accessor: "node.studentCount", align: "center" },
    {
      header: `${t("View")}`, align: "center",
      render: (item) => <div
        className="flex flex-row gap-2 items-center justify-center p-1 rounded-full"
      >
        <div className='flex flex-row gap-2'>
          <ButtonAction data={item} type='edit' action={() => { setShowModal({ show: true, type: "update" }); setSelectedItem(item) }} />
          <ButtonAction data={item} type='delete' action={() => { setShowModal({ show: true, type: "delete" }); setSelectedItem(item) }} />
          <button
            onClick={() => router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageAcademics/pageClassrooms/${item.node.id}`)}
            className="bg-green-200 p-1 rounded-full"
          >
            <FaRightLong color="green" size={21} />
          </button>
        </div>
      </div>
    },
  ];

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      downloadComponent={<></>
        // <ExcelExporter
        //   data={activeTab ? data?.allMainSpecialties?.edges : data?.allSpecialties?.edges}
        //   title={activeTab ? "MainSpecialties" : "Specialties"}
        //   type={activeTab ? "MainSpecialty" : "Specialty"}
        //   page={activeTab ? "list_main_specialty" : "list_specialty"}
        //   searchParams={activeTab ? { "name": "List" } : sp}
        // />
      }
      searchComponent={
        <SearchMultiple
          names={['level', 'stream']}
          link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageAcademics/pageClassrooms`}
          select={[
            { type: 'select', name: 'academicYear', dataSelect: data?.allAcademicYearsSec },
          ]}
        />
      }
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
          {
          data?.allClassroomsSec ?
            <MyTableComp
              columns={Columns}
              data={
                data?.allClassroomsSec?.edges.sort((a: EdgeClassRoomSec, b: EdgeClassRoomSec) => {
                  const levelA = a.node.level.toLowerCase();
                  const levelB = b.node.level.toLowerCase();

                  return levelA.localeCompare(levelB);
                })}
              table_title={t("Classrooms")}
              button_type={"add"}
              button_action={() => {setShowModal({ show: true, type: "create" }); setSelectedItem(null)}}
            />
            :
            null
          }
        </div>


        {<MyModal
          component={<ModalCUDClassroomSec
            params={params}
            setOpenModal={setShowModal}
            actionType={showModal?.type || "create"}
            selectedItem={selectedItem}
            apiLevel={apiLevel}
            apiClassType={apiClassType}
            apiSeries={data.allSeries?.edges}
          />}
          openState={showModal?.show || false}
          onClose={() => setShowModal({ show: false, type: "create" })}
          title={showModal?.type || ""}
          classname=''
        />
        }


      </div>
    </DefaultLayout>
  );
};

export default List;

