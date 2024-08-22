'use client';
import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import SearchMultiple from '@/Search/SearchMultiple';
import { EdgeTranscriptApplications } from '@/Domain/schemas/interfaceGraphql';
import { useRouter } from 'next/navigation';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import ExcelExporter from '@/ExcelExporter';
import MyTabs from '@/MyTabs';


const List = ({ params, dataPending, dataApproved, dataPrinted, searchParams }: { params: any; dataPending: any, dataApproved: any, dataPrinted: any, searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);


  const Columns: TableColumn<EdgeTranscriptApplications>[] = [
    { header: "#", align: "center", render: (_item: EdgeTranscriptApplications, index: number) => index + 1, },
    { header: "Full Name", accessor: "node.userprofile.customuser.fullName", align: "left" },
    { header: "Class", accessor: "node.userprofile.specialty.mainSpecialty.specialtyName", align: "left" },
    { header: "Level", accessor: "node.userprofile.specialty.level.level", align: "center" },
    { header: "Year", accessor: "node.userprofile.specialty.academicYear", align: "center" },
    {
      header: "Date", align: "center",
      render: (item) => <>
        {activeTab === 0 ? <span>{item.node.createdAt.slice(0, 10)}</span> : null}
        {activeTab === 1 ? <span>{item.node.approvedAt.slice(0, 10)}</span> : null}
        {activeTab === 2 ? <span>{item.node.printedAt.slice(0, 10)}</span> : null}
      </>,
    },
    {
      header: "Action", align: "center", hideColumn: activeTab > 0 ? true : false,
      render: (item) => <button
        onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript/${item.node.userprofile.schoolfees.id}/all`)}
        className='flex items-center justify-center w-full'
      >
        <FaRightLong color="green" size={21} />
      </button>,
    },
  ];

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      downloadComponent={<ExcelExporter
        data={dataPending?.allUserProfiles?.edges}
        title="ClassList"
        type="UserProfile"
        page="list_student_specialty"
        searchParams={searchParams}
      />}
      searchComponent={
        <SearchMultiple
          names={['fullName']}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`}
          select={[
            { type: 'select', name: 'academicYear', dataSelect: dataPending?.allAcademicYears },
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
      <Breadcrumb
        department="Transcript"
        subRoute="List"
        pageName="Transcript"
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`}
      />

      <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">

        {dataPending && dataApproved && dataPrinted ? (
          <MyTabs
            tabs={[
              { label: 'Pending', content: <Table data={dataPending.allTranscriptApplications.edges} columns={Columns} /> },
              // { label: 'Approved', content: <Table data={dataApproved.allTranscriptApplications.edges} columns={Columns} /> },
              { label: 'Printed', content: <Table data={dataPrinted.allTranscriptApplications.edges} columns={Columns} /> },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            source={`Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript/?`}
          />
        ) : (
          <ServerError type="network" item="Transcript" />
        )}


      </div>
    </DefaultLayout>
  );
};

export default List;



const Table = ({ data, columns }: { data: any, columns: any }) => {

  return <div className='flex flex-col gap-2 items-center justify-center w-full'>
    <MyTableComp
      data={data}
      columns={columns}
    />
  </div>
}