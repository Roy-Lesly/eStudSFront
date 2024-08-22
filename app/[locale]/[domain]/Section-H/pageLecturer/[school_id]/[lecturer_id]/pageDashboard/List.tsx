'use client';

import React, { useState } from 'react'; // Importing icons
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { GetMenuLecturer } from '@/section-h/Sidebar/MenuLecturer';
import SearchMultiple from '@/Search/SearchMultiple';
import { useTranslation } from 'react-i18next';

export const metadata: Metadata = {
  title: "Dashboard Page",
  description: "e-conneq School System. Dashboard Page Lecturer Settings",
};


const List = ({ params, data }: { params: any; data: any }) => {
  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      pageType='teacher'
      domain={params.domain}
      sidebar={
        <Sidebar
          params={params}
          menuGroups={GetMenuLecturer(params)}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      }
      headerbar={
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchComponent={
            <SearchMultiple
              names={["name"]}
              link={`/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyDashboard`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department={t("My Dashboard")}
        subRoute="List"
        pageName={t("My Dashboard")}
        mainLink={`${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyDashboard`}
        subLink={`${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyDashboard`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-4">
        {data ? (
          data.allCourses.edges.length ? (
            <DataTable
              data={data?.allCourses?.edges}
            />
          ) : (
            <ServerError type="notFound" item={t("Course")} />
          )
        ) : (
          <ServerError type="network" item={t("Course")} />
        )}


      </div>
    </DefaultLayout>
  );
};

export default List;


const DataTable = ({ data }: { data: EdgeCourse[] }) => {

  const { t } = useTranslation("common");
  const Columns: TableColumn<EdgeCourse>[] = [
    {
      header: "#",
      align: "center",
      render: (_item: EdgeCourse, index: number) => index + 1,
    },
    {
      header: `${t("Course Code")}`,
      accessor: "node.courseCode",
      align: "left",
    },
    {
      header: `${t("Course Name")}`,
      accessor: "node.mainCourse.courseName",
      align: "left",
    },
    {
      header: `${t("Semester")}`,
      accessor: "node.semester",
      align: "center",
    },
    {
      header: `${t("Credit")}`,
      accessor: "node.courseCredit",
      align: "center",
    },
    {
      header: `${t("Course Type")}`,
      accessor: "node.courseType",
      align: "left",
    },
    {
      header: `${t("Lecturer")}`,
      accessor: "node.assignedTo.fullName",
      align: "left",
    },

  ];

  return <div className='w-full'>
    {data?.length ? (
      <MyTableComp
        columns={Columns}
        data={data}
        rowKey={(item, index) => item.node.id || index}
      />
    ) : (
      <div>No data available</div> // Optional: Show a fallback message when no data is present.
    )}
  </div>
}
