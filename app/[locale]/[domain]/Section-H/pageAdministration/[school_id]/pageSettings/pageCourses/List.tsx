'use client';

import React, { FC, useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import { Metadata } from 'next';
import DefaultLayout from '@/DefaultLayout';
import { EdgeDomain, EdgeMainCourse, EdgeCourse, EdgeLevel, EdgeSpecialty, EdgeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import SearchMultiple from '@/Search/SearchMultiple';
import MyTabs from '@/MyTabs';
import ExcelExporter from '@/ExcelExporter';
import ButtonAction from '@/Buttons/ButtonAction';
import MyModal from '@/MyModals/MyModal';
import { FaPlus } from 'react-icons/fa';
import { FaRightLong } from 'react-icons/fa6';
import PerformanceCourse from './PerformanceCourse';
import ModalCUDMainCourse from '@/MyModals/ModalCUDMainCourse';
import ModalCUDCourse from '@/MyModals/ModalCUDCourse';
import ServerError from '@/ServerError';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';


export const metadata: Metadata = {
  title: "Courses Page",
  description: "e-conneq School System. Courses Page Admin Settings",
};

const List = (
  { params, data, searchParams, users }:
    { params: any; data: any, searchParams: any, users: EdgeCustomUser[] }
) => {

  const router = useRouter();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(parseInt(searchParams?.tab) || 0);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);


  const Columns: TableColumn<EdgeCourse>[] = [
    { header: "#", align: "center", render: (_item: EdgeCourse, index: number) => index + 1, },
    { header: `${t("Course Name")}`, accessor: "node.mainCourse.courseName", align: "left" },
    { header: `${t("Class")}`, accessor: "node.specialty.mainSpecialty.specialtyName", align: "left" },
    { header: `${t("Year")}`, accessor: "node.specialty.academicYear", align: "center" },
    { header: `${t("level")}`, accessor: "node.specialty.level.level", align: "center" },
    { header: `${t("Sem")}`, accessor: "node.semester", align: "center" },
    { header: `${t("Resit")}`, accessor: "node.countResit", align: "center" },
    {
      header: `${t("View")}`, align: "center",
      render: (item) => <div className='flex flex-row gap-2 justify-center'>
        <ButtonAction data={item} type='edit' action={() => { setShowModal({ show: true, type: "update" }); setSelectedItem(item) }} />
        <ButtonAction data={item} type='delete' action={() => { setShowModal({ show: true, type: "delete" }); setSelectedItem(item) }} />
        <button
          onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/${item.node.id}`)}
          className="bg-green-200 p-1 rounded-full"
        >
          <FaRightLong color="green" size={21} />
        </button>
      </div>
    },
  ];

  const ColumnsMain: TableColumn<EdgeMainCourse>[] = [
    { header: "#", align: "center", render: (_item: EdgeMainCourse, index: number) => index + 1, },
    { header: `${t("Course Name")}`, accessor: "node.courseName", align: "left" },
    {
      header: `${t("View")}`, align: "center",
      render: (item) => <div className='flex flex-row gap-2 justify-center'>
        <ButtonAction data={item} type='edit' action={() => { setShowModal({ show: true, type: "update" }); setSelectedItem(item) }} />
        <ButtonAction data={item} type='delete' action={() => { setShowModal({ show: true, type: "delete" }); setSelectedItem(item) }} />
      </div>
    },
  ];

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      downloadComponent={<ExcelExporter
        data={activeTab ? data?.allMainCourses?.edges : data?.allCourses?.edges}
        title={activeTab ? "MainCourse" : "Course"}
        type={activeTab ? "MainCourse" : "Course"}
        page={activeTab ? "list_main_course" : "list_course"}
        searchParams={activeTab ? { "name": "List" } : searchParams}
      />}
      searchComponent={
        <SearchMultiple
          names={['courseName']}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`}
          select={[
            { type: 'select', name: 'academicYear', dataSelect: data?.allAcademicYears },
            { type: 'select', name: 'level', dataSelect: data?.allLevels?.edges.map((item: EdgeLevel) => item.node.level) },
            {
              type: 'searchAndSelect',
              name: 'specialtyName',
              dataSelect: data?.allSpecialties?.edges?.map((item: EdgeSpecialty) => item.node.mainSpecialty.specialtyName),
            },
            {
              type: 'searchAndSelect',
              name: 'domainName',
              dataSelect: data?.allDomains?.edges?.map((item: EdgeDomain) => item.node?.domainName),
            },
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

          {data && !data?.error ? (
            <MyTabs
              tabs={[
                {
                  label: `${t('Courses')}`, content: data?.allCourses?.edges.length ?
                    <>
                      {selectedCourse ?
                        <PerformanceCourse />
                        :
                        <MyTableComp
                          data={
                            data?.allCourses?.edges.sort((a: EdgeCourse, b: EdgeCourse) => {
                              const courseNameA = a.node.mainCourse.courseName.toLowerCase();
                              const courseNameB = b.node.mainCourse.courseName.toLowerCase();
                              const levelA = a.node.specialty.level.level;
                              const levelB = b.node.specialty.level.level;
                              if (courseNameA > courseNameB) return 1;
                              if (courseNameA < courseNameB) return -1;
                              if (levelA > levelB) return 1;
                              if (levelA < levelB) return -1;
                            })}
                          columns={Columns}
                        />
                      }
                    </>
                    :
                    <ServerError type="notFound" item={t("Courses")} />,
                  icon: <button
                    className='bg-green-300 flex gap-2 p-2 rounded-full'
                    onClick={() => { setShowModal({ type: "create", show: true }); setSelectedItem(null) }}
                  ><FaPlus size={20} /></button>
                },
                {
                  label: `${t('Main Courses')}`, content: data?.allMainCourses?.edges.length ?
                    <MyTableComp
                      data={
                        data?.allMainCourses?.edges.sort((a: EdgeMainCourse, b: EdgeMainCourse) => {
                          const specialtyNameA = a.node.courseName.toLowerCase();
                          const specialtyNameB = b.node.courseName.toLowerCase();
                          return specialtyNameA.localeCompare(specialtyNameB);
                        })}
                      columns={ColumnsMain}
                    />
                    :
                    <ServerError type="notFound" item={t("Main Courses")} />,
                  icon: <button
                    className='bg-green-300 flex gap-2 p-2 rounded-full'
                    onClick={() => { setShowModal({ type: "create", show: true }); setSelectedItem(null) }}
                  ><FaPlus size={20} /></button>
                },
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              source={`Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/?`}
            />
          )
            :
            <>
              {data?.error && data?.error === "Not Authenticated" ? <ServerError type="authentication" item="Courses" /> : null}
              {data?.error && data?.error === "Not Authenticated" ? <ServerError type="network" item="Courses" /> : null}
            </>
          }
        </div>



        {activeTab === 1 ? <MyModal
          component={<ModalCUDMainCourse
            params={params}
            setOpenModal={setShowModal}
            actionType={showModal?.type || "create"}
            selectedItem={selectedItem}
          />}
          openState={showModal?.show || false}
          onClose={() => setShowModal({ show: false, type: "create" })}
          title={showModal?.type || ""}
          classname=''
        />

          :

          <MyModal
            component={<ModalCUDCourse
              setOpenModal={setShowModal}
              actionType={showModal?.type || "create"}
              selectedItem={selectedItem}
              params={params}
              extraData={{
                specialties: data?.allSpecialties?.edges,
                mainCourses: data?.allMainCourses?.edges,
                teachers: users
              }}
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