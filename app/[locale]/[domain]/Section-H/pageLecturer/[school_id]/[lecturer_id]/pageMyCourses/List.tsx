'use client';

import React, { useEffect, useState } from 'react'; // Importing icons
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { getMenuLecturer } from '@/section-h/Sidebar/MenuLecturer';
import SearchMultiple from '@/section-h/Search/SearchMultiple';

export const metadata: Metadata = {
  title: "Assigned Subjects Page",
  description: "This is Assigned Subjects Page Admin Settings",
};


const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={["courseName"]}
          link={`/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyCourses`}
        />
      }
      sidebar={
        <Sidebar
          params={params}
          menuGroups={getMenuLecturer(params)}
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
      <Breadcrumb
        department="My Courses"
        subRoute="List"
        pageName="My Courses"
        mainLink={`${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyCourses`}
        subLink={`${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyCourses`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-4">
        {data ? (
          data.allCourses.edges.length ? (
            <DataTable data={data?.allCourses?.edges} />
          ) : (
            <ServerError type="notFound" item="Course" />
          )
        ) : (
          <ServerError type="network" item="Course" />
        )}


      </div>
    </DefaultLayout>
  );
};

export default List;


const DataTable = ({ data }: { data: EdgeCourse[] }) => {

  const Columns: TableColumn<EdgeCourse>[] = [
      {
          header: "#",
          align: "center",
          responsiveHidden: true,
          render: (_item: EdgeCourse, index: number) => index + 1,
      },
      {
          header: "Course Code",
          accessor: "node.courseCode",
          responsiveHidden: true,
          align: "left",
      },
      {
          header: "Course Name",
          accessor: "node.mainCourse.courseName",
          align: "left",
      },
      {
          header: "Sem",
          accessor: "node.semester",
          align: "center",
      },
      {
          header: "Credit",
          accessor: "node.courseCredit",
          responsiveHidden: true,
          align: "center",
      },
      {
          header: "Course Type",
          accessor: "node.courseType",
          responsiveHidden: true,
          align: "left",
      },
      {
          header: "Lecturer",
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
          />
      ) : (
          <div>No data available</div> // Optional: Show a fallback message when no data is present.
      )}
  </div>
}
