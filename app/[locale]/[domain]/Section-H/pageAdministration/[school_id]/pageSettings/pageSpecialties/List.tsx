'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/DefaultLayout';
import { EdgeDomain, EdgeMainSpecialty, EdgeSpecialty } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import MyTabs from '@/MyTabs';
import ExcelExporter from '@/ExcelExporter';
import ButtonAction from '@/section-h/Buttons/ButtonAction';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import MyModal from '@/MyModals/MyModal';
import ModalCUDSpecialty from '@/MyModals/ModalCUDSpecialty';
import ModalCUDMainSpecialty from '@/MyModals/ModalCUDMainSpecialty';
import ServerError from '@/ServerError';
import { useTranslation } from 'react-i18next';


export const metadata: Metadata = {
  title: "Specialty Page",
  description: "This is Specialty Page Admin Settings",
};

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(parseInt(searchParams?.tab) || 0);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const router = useRouter();

  const Columns: TableColumn<EdgeSpecialty>[] = [
    { header: "#", align: "center", render: (_item: EdgeSpecialty, index: number) => index + 1, },
    { header: `${t("Specialty Name")}`, accessor: "node.mainSpecialty.specialtyName", align: "left" },
    { header: `${t("Year")}`, accessor: "node.academicYear", align: "center" },
    { header: `${t("Level")}`, accessor: "node.level.level", align: "center" },
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
            onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/${item.node.id}`)}
            className="bg-green-200 p-1 rounded-full"
          >
            <FaRightLong color="green" size={21} />
          </button>
        </div>
      </div>
    },
  ];

  const ColumnsMain: TableColumn<EdgeMainSpecialty>[] = [
    { header: "#", align: "center", render: (_item: EdgeMainSpecialty, index: number) => index + 1, },
    { header: `${"Specialty Name"}`, accessor: "node.specialtyName", align: "left" },
    {
      header: "View", align: "center",
      render: (item) => <button
        className="gap-2 items-center justify-center p-1 rounded-full"
      >
        <div className='flex flex-row gap-2'>
          <ButtonAction data={item} type='edit' action={() => { setShowModal({ show: true, type: "update" }); setSelectedItem(item) }} />
          <ButtonAction data={item} type='delete' action={() => { setShowModal({ show: true, type: "delete" }); setSelectedItem(item) }} />

        </div>
      </button>,
    },
  ];

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      downloadComponent={<ExcelExporter
        data={activeTab ? data?.allMainSpecialties?.edges : data?.allSpecialties?.edges}
        title={activeTab ? "MainSpecialties" : "Specialties"}
        type={activeTab ? "MainSpecialty" : "Specialty"}
        page={activeTab ? "list_main_specialty" : "list_specialty"}
        searchParams={activeTab ? { "name": "List" } : searchParams}
      />}
      searchComponent={
        <SearchMultiple
          names={['specialtyName']}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`}
          select={[
            { type: 'select', name: 'academicYear', dataSelect: data?.allAcademicYears },
            {
              type: 'searchAndSelect',
              name: 'domainName',
              dataSelect: data?.allDomains?.edges?.map((item: EdgeDomain) => item.node.domainName),
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
          {data ? (
            <MyTabs
              tabs={[
                {
                  label: 'Classes', content: data?.allSpecialties?.edges.length ?
                    <MyTableComp
                      data={
                        data?.allSpecialties?.edges.sort((a: EdgeSpecialty, b: EdgeSpecialty) => {
                          const specialtyNameA = a.node.mainSpecialty.specialtyName.toLowerCase();
                          const specialtyNameB = b.node.mainSpecialty.specialtyName.toLowerCase();
                          const levelA = a.node.level.level;
                          const levelB = b.node.level.level;
                          if (specialtyNameA > specialtyNameB) return 1;
                          if (specialtyNameA < specialtyNameB) return -1;
                          if (levelA > levelB) return 1;
                          if (levelA < levelB) return -1;
                          // return levelA.localeCompare(levelB);
                        })}
                      columns={Columns}
                    />
                    :
                    <ServerError type="notFound" item="Classes" />,
                  icon: <button
                    className='bg-green-300 flex gap-2 p-2 rounded-full'
                    onClick={() => { setShowModal({ type: "create", show: true }); setSelectedItem(null) }}
                  ><FaPlus size={20} /></button>
                },
                {
                  label: 'Specialties', content: data?.allMainSpecialties?.edges.length ?
                    <MyTableComp
                      data={
                        data?.allMainSpecialties?.edges.sort((a: EdgeMainSpecialty, b: EdgeMainSpecialty) => {
                          const specialtyNameA = a.node.specialtyName.toLowerCase();
                          const specialtyNameB = b.node.specialtyName.toLowerCase();
                          return specialtyNameA.localeCompare(specialtyNameB);
                        })}
                      columns={ColumnsMain}
                    />
                    :
                    <ServerError type="notFound" item="Specialties" />,
                  icon: <button
                    className='bg-green-300 flex gap-2 p-2 rounded-full'
                    onClick={() => { setShowModal({ type: "create", show: true }); setSelectedItem(null) }}
                  ><FaPlus size={20} /></button>
                },
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              source={`Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/?`}
            />
          ) : (
            <ServerError type="network" item="Specialties" />
          )}
        </div>


        {activeTab === 1 ? <MyModal
          component={<ModalCUDMainSpecialty
            params={params}
            setOpenModal={setShowModal}
            actionType={showModal?.type || "create"}
            selectedItem={selectedItem}
            extraData={ {fields: data?.allFields?.edges} }
          />}
          openState={showModal?.show || false}
          onClose={() => setShowModal({ show: false, type: "create" })}
          title={showModal?.type || ""}
          classname=''
        />

          :

          <MyModal
            component={<ModalCUDSpecialty
              params={params}
              setOpenModal={setShowModal}
              actionType={showModal?.type || "create"}
              selectedItem={selectedItem}
              extraData={{ mainSpecialties: data?.allMainSpecialties?.edges, levels: data?.allLevels?.edges }}
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

