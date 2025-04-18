'use client';

import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import { getMenuLecturer } from '@/section-h/Sidebar/MenuLecturer';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import SearchMultiple from '@/section-h/Search/SearchMultiple';

export const metadata: Metadata = {
  title: "Marks Entry Page",
  description: "This is Marks Entry Page Lect Settings",
};


const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      domain={params.domain}
      searchComponent={
      <SearchMultiple
        names={["courseName", "semester"]}
        link={`/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMarksEntry`}
      />}
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
            <></>
          }
        />
      }
    >
      <Breadcrumb
        department="Marks Entry"
        subRoute="List"
        pageName="Marks Entry"
        mainLink={`${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMarksEntry`}
        subLink={`${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMarksEntry`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-4">
        {data ? (
          data.allCourses.edges.length ? (
            <DataTable data={data?.allCourses?.edges} params={params} />
          ) : (
            <ServerError type="notFound" item="Marks Entry" />
          )
        ) : (
          <ServerError type="network" item="Marks Entry" />
        )}


      </div>
    </DefaultLayout>
  );
};

export default List;


const DataTable = ({ data, params }: { data: EdgeCourse[], params: any }) => {

  const router = useRouter();
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
          header: "Course Name",
          accessor: "node.specialty.mainSpecialty.specialtyName",
          align: "left",
      },
      {
          header: "Semester",
          accessor: "node.semester",
          responsiveHidden: true,
          align: "center",
      },
      {
          header: "Credit",
          accessor: "node.courseCredit",
          responsiveHidden: true,
          align: "center",
      },
      {
          header: "Class / Year / Level",
          align: "left",
          render: (item: EdgeCourse) => (
            <span>{item.node.specialty.mainSpecialty?.specialtyName} - {item.node.specialty?.academicYear} - {item.node.specialty?.level.level}</span>
          )
      },
      {
            header: 'Select',
            align: 'center',
            render: (item: EdgeCourse) => (
              <button
                onClick={() => router.push(`/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMarksEntry/${item.node.id}/?sem=${item.node.semester}&spec=${item.node.specialty.id}`)}
                className="bg-green-200 p-2 rounded-full"
              >
                <FaRightLong color="green" size={23} />
              </button>
            ),
          },
      
  ];

  return <div className='w-full'>
      {data?.length ? (
          <MyTableComp
              columns={Columns}
              data={data.sort((a: EdgeCourse, b: EdgeCourse) => {
                const academicYearA = a.node.specialty.academicYear;
                const academicYearB = b.node.specialty.academicYear;
                const courseNameA = a.node.mainCourse.courseName.toLowerCase();
                const courseNameB = b.node.mainCourse.courseName.toLowerCase();

                if (academicYearA > academicYearB) return -1;
                if (academicYearA < academicYearB) return 1;

                return courseNameA.localeCompare(courseNameB);
                })}
              rowKey={(item, index) => item.node.id || index}
          />
      ) : (
          <div>No data available</div>
      )}
  </div>
}
