'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { EdgeUserProfile } from '@/Domain/schemas/interfaceGraphql';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import ExcelExporter from '@/ExcelExporter';
import ServerError from '@/ServerError';
import { useTranslation } from 'react-i18next';


export const metadata: Metadata = {
  title: "Student Page",
  description: "This is Student Page Admin Settings",
};

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  const Columns: TableColumn<EdgeUserProfile>[] = [
    { header: "#", align: "center", render: (_item: EdgeUserProfile, index: number) => index + 1, },
    { header: `${t("Matricle")}`, accessor: "node.customuser.matricle", align: "left" },
    { header: `${t("Full Name")}`, accessor: "node.customuser.fullName", align: "left" },
    { header: `${t("Gender")}`, accessor: "node.customuser.sex", align: "center" },
    { header: `${t("Class")}`, accessor: "node.specialty.mainSpecialty.specialtyName", align: "left" },
    {
      header: `${t("Year / Level")}`, align: "left", render: (item) => <button
        className=""
      >
        {item.node.specialty.academicYear} / {item.node.specialty.level.level}
      </button>,
    },
    {
      header: `${t("View")}`, align: "center",
      render: (item) => <button
        onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${item.node.id}/?user=${item.node.customuser.id}`)}
        className="bg-green-200 p-2 rounded-full"
      >
        <FaRightLong color="green" size={21} />
      </button>,
    },
  ];

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      // downloadComponent={<ExcelExporter
      //   data={data?.allUserProfiles?.edges}
      //   title="ClassList"
      //   type="UserProfile"
      //   page="list_student_specialty"
      //   searchParams={searchParams}
      // />}
      searchComponent={
        <SearchMultiple
          names={['fullName', 'specialtyName', 'level', 'sex', 'academicYear']}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents`}
          select={[
            // { type: 'select', name: 'sex', dataSelect: ['MALE', 'FEMALE'] },
            // { type: 'select', name: 'academicYear', dataSelect: data?.allAcademicYears },
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
        department={t("Students")}
        subRoute="List"
        pageName={t("Students")}
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/Settings/Students/`}
        subLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/Settings/Students/`}
      />

      <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">

        <button
          onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/Admit`)}
          className="bg-blue-600 flex focus:outline-none gap-2 hover:bg-blue-700 items-center mb-2 px-4 py-2 rounded text-white"
        >
          <FaPlus />{t("Register")}
        </button>

        {data ? (
          data.allUserProfiles.edges.length ? (
            <MyTableComp
              data={
                data.allUserProfiles.edges.sort((a: EdgeUserProfile, b: EdgeUserProfile) => {
                  const academicYearA = a.node.specialty.academicYear;
                  const academicYearB = b.node.specialty.academicYear;
                  const fullNameA = a.node.customuser.fullName.toLowerCase();
                  const fullNameB = b.node.customuser.fullName.toLowerCase();

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


      </div>
    </DefaultLayout>
  );
};

export default List;