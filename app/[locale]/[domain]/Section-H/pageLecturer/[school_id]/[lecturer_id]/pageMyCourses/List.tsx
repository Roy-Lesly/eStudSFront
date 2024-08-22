'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { GetMenuLecturer } from '@/section-h/Sidebar/MenuLecturer';
import SearchMultiple from '@/Search/SearchMultiple';
import { useTranslation } from 'react-i18next';

export const metadata: Metadata = {
  title: "Assigned Subjects Page",
  description: "e-conneq School System. Assigned Subjects Page Admin Settings",
};


const List = ({ params, data }: { params: any; data: any }) => {
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      pageType='teacher'
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={["courseName", "semester", "academicYear", "level"]}
          link={`/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMarksEntry`}
        />}
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
            <h1>Lecturer</h1>
          }
        />
      }
    >


      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-4">
        {data ?
          <DataTable data={data?.allCourses?.edges} />
          :
          <ServerError type="network" item={t("MyCourses")} />
        }


      </div>
    </DefaultLayout>
  );
};

export default List;


const DataTable = ({ data }: { data: EdgeCourse[] }) => {
  const { t } = useTranslation()

  const Columns: TableColumn<EdgeCourse>[] = [
    {
      header: "#",
      align: "center",
      responsiveHidden: true,
      render: (_item: EdgeCourse, index: number) => index + 1,
    },
    {
      header: `${t("Course Code")}`,
      accessor: "node.courseCode",
      responsiveHidden: true,
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
      responsiveHidden: true,
      align: "center",
    },
    {
      header: `${t("CourseType")}`,
      accessor: "node.courseType",
      responsiveHidden: true,
      align: "left",
    },
    {
      header: `${t("Lecturer")}`,
      accessor: "node.assignedTo.fullName",
      responsiveHidden: true,
      align: "left",
    },

  ];

  return <div className='w-full'>
    {data?.length ? (
      <MyTableComp
        columns={Columns}
        data={data.sort((a: EdgeCourse, b: EdgeCourse) => a.node.mainCourse.courseName > b.node.mainCourse.courseName ? 1 : a.node.mainCourse.courseName < b.node.mainCourse.courseName ? -1 : 0)}
        rowKey={(item, index) => item.node.id || index}
        table_title={`${t("My Courses Long")}`}
      />
    ) : (
      <div>{t("No data available")}</div> // Optional: Show a fallback message when no data is present.
    )}
  </div>
}
