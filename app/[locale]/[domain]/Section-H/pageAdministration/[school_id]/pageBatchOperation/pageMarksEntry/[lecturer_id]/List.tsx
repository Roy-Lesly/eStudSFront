'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { decodeUrlID } from '@/functions';
import { useTranslation } from 'react-i18next';


export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "This is Main-Subject Page Admin Settings",
};


export const parseJson = (data: string | Record<string, boolean>): Record<string, boolean> => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return {};
    }
  }
  return data;
};

const List = ({ params, data }: { params: any; data: any }) => {
  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  const Columns: TableColumn<EdgeCourse>[] = [
    {
      header: '#',
      align: 'left',
      render: (_item: EdgeCourse, index: number) => index + 1,
    },
    {
      header: `${t("Course Name")}`,
      accessor: 'node.mainCourse.courseName',
      align: 'left',
    },
    {
      header: `${t("Class")}`,
      accessor: 'node.specialty.mainSpecialty.specialtyName',
      align: 'left',
    },
    {
      header: `${t("Year")}`,
      accessor: 'node.specialty.academicYear',
      align: 'left',
    },
    {
      header: `${t("Level")}`,
      accessor: 'node.specialty.level.level',
      align: 'left',
    },
    {
      header: 'Sem',
      accessor: 'node.semester',
      align: 'left',
    },
    {
      header: 'Rate(CA, Exam, Resit) %',
      align: 'center',
      render: (item: EdgeCourse) => (
        <motion.div
          className="bg-gray-50 flex flex-col gap-4 items-center justify-center p-1 rounded-md shadow-lg sm:flex-row text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.span
            className={`flex items-center justify-center w-12 h-12 font-semibold text-white rounded-full shadow-xl ${item.node?.percentageCa > 49.99 ? "bg-green-700" : "bg-green-300"
              }`}
            whileHover={{ scale: 1.1 }}
          >
            {item.node.percentageCa}
          </motion.span>
          <motion.span
            className={`flex items-center justify-center w-12 h-12 font-semibold text-white rounded-full shadow-xl ${item.node?.percentageExam > 49.99 ? "bg-blue-700" : "bg-blue-300"
              }`}
            whileHover={{ scale: 1.1 }}
          >
            {item.node.percentageExam}
          </motion.span>
          <motion.span
            className={`flex items-center justify-center w-12 h-12 font-semibold text-white rounded-full shadow-xl ${item.node?.percentageResit > 49.99 ? "bg-purple-700" : "bg-purple-300"
              }`}
            whileHover={{ scale: 1.1 }}
          >
            {item.node.percentageResit}
          </motion.span>
        </motion.div>
      ),
    },
    {
      header: 'Select',
      align: 'center',
      render: (item: EdgeCourse) => (
        <button
          onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/details/${decodeUrlID(item.node.id.toString())}?lec=${params.lecturer_id}&sem=${item.node.semester}&spec=${item.node.specialty.id}`)}
          className="bg-green-200 p-2 rounded-full"
        >
          <FaRightLong color="green" size={23} />
        </button>
      ),
    },
  ];


  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
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
            <SearchMultiple
              names={['academicYear', 'level', 'stream']}
              link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/Results/Publish`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="My Courses"
        subRoute="List"
        pageName="Courses"
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/Results/Publish/`}
        subLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/Results/Publish/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        {data ? (
          data.allCourses.edges.length ? (
            <div className='flex flex-col gap-2 w-full'>
              <div className="flex font-bold italic justify-center text-center text-xl tracking-widest">
                <h1>{data.allCourses.edges[0].node.assignedTo?.fullName} -  COURSES</h1>
              </div>
              <MyTableComp
                // data={data?.allCourses?.edges}
                data={data?.allCourses?.edges.sort((a: EdgeCourse, b: EdgeCourse) => {
                  const academicYearA = a.node.specialty.academicYear;
                  const academicYearB = b.node.specialty.academicYear;
                  const courseNameA = a.node.mainCourse.courseName.toLowerCase();
                  const courseNameB = b.node.mainCourse.courseName.toLowerCase();

                  if (academicYearA > academicYearB) return -1;
                  if (academicYearA < academicYearB) return 1;

                  return courseNameA.localeCompare(courseNameB);
                })}
                rowKey={(item, index) => item.node.id || index}
                columns={Columns}
              />
            </div>
          ) : (
            <ServerError type="notFound" item="Courses" />
          )
        ) : (
          <ServerError type="network" item="Courses" />
        )}

      </div>
    </DefaultLayout>
  );
};

export default List;










