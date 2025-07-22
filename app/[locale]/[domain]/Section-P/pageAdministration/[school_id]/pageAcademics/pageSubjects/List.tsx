'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-p/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import ExcelExporter from '@/ExcelExporter';
import ButtonAction from '@/section-h/Buttons/ButtonAction';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import MyModal from '@/MyModals/MyModal';
import { useTranslation } from 'react-i18next';
import ModalSelectProperties from './ModalSelectProperties';
import { EdgeSubjectPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';


const List = (
  { params, data, sp, apiYears, apiLevels }:
  { params: any; data: any, sp: any, apiYears: any, apiLevels: string[] }
) => {

  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const router = useRouter();

  console.log(data);
  console.log(apiYears);
  console.log(apiLevels);

  const Columns: TableColumn<EdgeSubjectPrim>[] = [
    { header: "#", align: "center", render: (_item: EdgeSubjectPrim, index: number) => index + 1, },
    { header: `${t("Subject")}`, accessor: "node.mainsubjectprim.subjectName", align: "left" },
    { header: `${t("Class")}`, accessor: "node.classroomprim.level", align: "left" },
    { header: `${t("Section")}`, accessor: "node.classroomprim.stream", align: "center" },
    { header: `${t("Year")}`, accessor: "node.classroomprim.academicYear", align: "center" },
    { header: `${t("Fees")}`, accessor: "node.classroomprim.tuition", align: "center" },
    { header: `${t("Students")}`, accessor: "node.studentCount", align: "center" },
    {
      header: `${t("View")}`, align: "center",
      render: (item) => <div
        className="flex flex-row gap-2 items-center justify-center p-1 rounded-full"
      >
        <div className='flex flex-row gap-2'>
          <button
            onClick={() => router.push(`/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageAcademics/pageSubjects/${item.node.id}`)}
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
          link={`/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageAcademics/pageClassrooms`}
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
            data ?
              <MyTableComp
                columns={Columns}
                data={
                  data.sort((a: EdgeSubjectPrim, b: EdgeSubjectPrim) => {
                    const levelA = a.node.classroomprim?.level.toLowerCase();
                    const levelB = b.node.classroomprim?.level.toLowerCase();
                    return levelA.localeCompare(levelB);
                  })}
                table_title={t("Assigned Subjects")}
                button_type={"add"}
                button_action={() => { setShowModal({ show: true, type: "create" }) }}
                setActionType={() => {}}
              />
              :
              null
          }
        </div>


        {<MyModal
          component={
            <ModalSelectProperties
              params={params}
              apiYears={apiYears}
              apiLevels={apiLevels}
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

