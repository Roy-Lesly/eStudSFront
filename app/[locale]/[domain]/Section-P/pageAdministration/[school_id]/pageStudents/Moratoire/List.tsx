'use client';
import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { EdgeMoratoire, NodeMoratoire } from '@/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import MyTabs from '@/MyTabs';
import { useTranslation } from 'react-i18next';
import ServerError from '@/ServerError';
import MyTableComp from '@/section-h/Table/MyTableComp';
import ModalDecision from './ModalDecision';


const List = (
  { params, dataPending, dataApproved, dataRejected, sp }
    :
    { params: any; dataPending: any, dataApproved: any, dataRejected: any, sp: any }
) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={['fullName', 'specialtyName', 'level']}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/Moratoire`}
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
          <MyTabs
            tabs={[
              {
                label: t("Pending"),
                content: <Applied data={dataPending} activeTab={activeTab} />
              },
              {
                label: t("Approved"),
                content: <Applied data={dataApproved} activeTab={activeTab} />
              },
              {
                label: t("Rejected"),
                content: <Applied data={dataRejected} activeTab={activeTab} />
              },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

    </DefaultLayout>
  );
};

export default List;



const Applied = ({ data, activeTab }: { data: any, activeTab: number }) => {

  const [showModal, setShowModal] = useState<{ state: boolean, selectedItem: NodeMoratoire | null }>({ state: false, selectedItem: null })

  const Columns: TableColumn<EdgeMoratoire>[] = [
    { header: "#", align: "center", render: (_item: EdgeMoratoire, index: number) => index + 1, },
    { header: "Matricle", accessor: "node.userprofile.customuser.matricle", align: "left" },
    { header: "Full Name", accessor: "node.userprofile.customuser.fullName", align: "left" },
    { header: "Class", accessor: "node.userprofile.specialty.mainSpecialty.specialtyName", align: "left" },
    {
      header: "Year / Level", align: "left", render: (item) => <button
        className=""
      >
        {item.node.userprofile.specialty.academicYear} / {item.node.userprofile.specialty.level.level}
      </button>,
    },
    {
      header: "View", align: "center",
      render: (item) => <button
        onClick={() => setShowModal({ state: true, selectedItem: item.node })}
        className="bg-green-200 p-1 rounded-full"
      >
        <FaRightLong color="green" size={21} />
      </button>,
    },
  ];

  return <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">
    {data ? (
      data.allMoratoires?.edges.length ? (
        <MyTableComp
          data={
            data.allMoratoires?.edges.sort((a: EdgeMoratoire, b: EdgeMoratoire) => {
              const academicYearA = a.node.userprofile.specialty.academicYear;
              const academicYearB = b.node.userprofile.specialty.academicYear;
              const fullNameA = a.node.userprofile.customuser.fullName.toLowerCase();
              const fullNameB = b.node.userprofile.customuser.fullName.toLowerCase();

              if (academicYearA > academicYearB) return -1;
              if (academicYearA < academicYearB) return 1;

              return fullNameA.localeCompare(fullNameB);
            })}
          columns={Columns}
        />
      ) : (
        <ServerError type="notFound" item="Students" />
      )
    ) : (
      <ServerError type="network" item="Students" />
    )}


    {showModal.state && showModal.selectedItem ?
      <ModalDecision
        moratoire={showModal.selectedItem}
        tab={activeTab}
        onClose={() => setShowModal({ state: false, selectedItem: null })}
      />
      :
      null}


  </div>
}