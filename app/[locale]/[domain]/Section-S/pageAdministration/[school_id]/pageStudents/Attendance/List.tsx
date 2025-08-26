'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import { EdgeClassRoomSec, TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import SearchMultiple from '@/Search/SearchMultiple';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import MyTableComp from '@/components/Table/MyTableComp';


const List = (
  { params, data }:
  { params: any; data: any }
) => {

  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
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
    { header: `${t("Students")}`, accessor: "node.studentCount", align: "center" },
    {
      header: `${t("View")}`, align: "center",
      render: (item) => <div
        className="flex flex-row gap-2 items-center justify-center p-1 rounded-full"
      >
        <div className='flex flex-row gap-2'>
          <button
            onClick={() => router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageStudents/Attendance/${item.node.id}`)}
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
      downloadComponent={null
      }
      searchComponent={
        <SearchMultiple
          names={['level', 'stream']}
          link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageStudents/Attendance`}
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
              table_title={t("Attendance Section")}
              // button_type={"add"}
              // button_action={() => {setShowModal({ show: true, type: "create" }); setSelectedItem(null)}}
            />
            :
            null
          }
        </div>

      </div>
    </DefaultLayout>
  );
};

export default List;

