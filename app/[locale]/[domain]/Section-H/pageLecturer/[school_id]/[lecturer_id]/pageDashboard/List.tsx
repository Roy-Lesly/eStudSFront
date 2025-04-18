'use client';

import React, {useState } from 'react'; // Importing icons
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
            <SearchMultiple
              names={["name"]}
              link={`/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyDashboard`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="My Dashboard"
        subRoute="List"
        pageName="My Dashboard"
        mainLink={`${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyDashboard`}
        subLink={`${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyDashboard`}
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
          render: (_item: EdgeCourse, index: number) => index + 1,
      },
      {
          header: "Course Code",
          accessor: "node.courseCode",
          align: "left",
      },
      {
          header: "Course Name",
          accessor: "node.mainCourse.courseName",
          align: "left",
      },
      {
          header: "Semester",
          accessor: "node.semester",
          align: "center",
      },
      {
          header: "Credit",
          accessor: "node.courseCredit",
          align: "center",
      },
      {
          header: "Course Type",
          accessor: "node.courseType",
          align: "left",
      },
      {
          header: "Lecturer",
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
