'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/components/Table/MyTableComp';
import { EdgeSeries, EdgeSubjectSec, NodeSubSubjectSec, TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import SearchMultiple from '@/Search/SearchMultiple';
import ExcelExporter from '@/ExcelExporter';
import ButtonAction from '@/Buttons/ButtonAction';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import MyModal from '@/MyModals/MyModal';
import { useTranslation } from 'react-i18next';
import ModalSelectProperties from './ModalSelectProperties';
import { capitalizeFirstLetter } from '@/utils/functions';


const List = (
  { p, data, sp, apiYears, apiLevels, apiSeries }:
    { p: any; data: any, sp: any, apiYears: any, apiLevels: string[], apiSeries: EdgeSeries[] }
) => {

  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<EdgeSubjectSec | null>(null);

  console.log(data);

  const Columns: TableColumn<EdgeSubjectSec>[] = [
    { header: "#", align: "center", render: (_item: EdgeSubjectSec, index: number) => index + 1, },
    { header: `${t("Subject")}`, accessor: "node.mainsubject.subjectName", align: "left" },
    { header: `${t("Class")} / ${t("Section")}`, align: "left",
      render: (item: EdgeSubjectSec) => <div className="flex flex-row gap-2 items-center justify-between p-1 rounded-full">
        <span>{item.node.classroomsec.level}</span>
        <span>{item.node.classroomsec.stream}</span>
      </div>
    },
    { header: `${t("Coef")}`, accessor: "node.subjectCoefficient", align: "center" },
    { header: `${t("Year")}`, accessor: "node.classroomsec.academicYear", align: "center" },
    {
      header: `${t("Teacher")}`, align: "center",
      render: (item: EdgeSubjectSec) => <div className="flex flex-row gap-2 items-center justify-center p-1 rounded-full">
        {!item.node.hasSubSubjects ? 
         <div className='flex flex-col gap-2'>
          <span className='w-full text-sm'>{item.node.assignedTo?.firstName}</span>
          <span className='w-full text-sm'>{item.node.assignedToTwo?.firstName}</span>
        </div>
        :
        <div className='flex flex-col w-full gap-2'>
          {item.node.subsubjectList?.map((ss: NodeSubSubjectSec, idx: number) => 
          <span className='flex flex-row  w-full justify-between gap-2 text-sm' key={ss.id}>
            <span className='w-full flex'>{capitalizeFirstLetter(ss.name)},</span>
            <span className='text-green-600 font-medium'>{ss?.assignedTo?.firstName}</span>
          </span>
        )}
        </div>}
      </div>
    },
    {
      header: `${t("View")}`, align: "center",
      render: (item) => <div className="flex flex-row gap-2 items-center justify-center p-1 rounded-full">
        <div className='flex flex-row gap-2'>
          <button
            onClick={() => router.push(`/${p.domain}/Section-S/pageAdministration/${p.school_id}/pageAcademics/pageSubjects/${item.node.id}`)}
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
      domain={p.domain}
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
          names={['subjectName']}
          link={`/${p.domain}/Section-S/pageAdministration/${p.school_id}/pageAcademics/pageSubjects`}
          select={[
            { type: 'select', name: 'level', dataSelect: apiLevels },
            { type: 'select', name: 'academicYear', dataSelect: apiYears },
            { type: 'select', name: 'hasSubSubjects', dataSelect: ["Yes", "No"] },
          ]}
        />
      }
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
          {
            data ?
              <MyTableComp
                columns={Columns}
                data={
                  data.sort((a: EdgeSubjectSec, b: EdgeSubjectSec) => {
                    const levelA = a.node.classroomsec?.level.toLowerCase();
                    const levelB = b.node.classroomsec?.level.toLowerCase();
                    return levelA.localeCompare(levelB);
                  })}
                table_title={t("Assigned Subjects")}
                button_type={"add"}
                button_action={() => { setShowModal({ show: true, type: "create" }); setSelectedItem(null) }}
              />
              :
              null
          }
        </div>


        {<MyModal
          component={
            <ModalSelectProperties
              params={p}
              apiYears={apiYears}
              apiLevels={apiLevels}
              apiSeries={apiSeries}
              setOpenModal={setShowModal}
            />
          }
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

