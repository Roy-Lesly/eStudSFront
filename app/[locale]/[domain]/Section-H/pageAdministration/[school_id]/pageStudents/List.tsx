'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import { Metadata } from 'next';
import SearchMultiple from '@/Search/SearchMultiple';
import { EdgeUserProfile } from '@/Domain/schemas/interfaceGraphql';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import ExcelExporter from '@/ExcelExporter';
import ServerError from '@/ServerError';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';


export const metadata: Metadata = {
  title: "Student Page",
  description: "e-conneq School System. Student Page Admin Settings",
};

const List = ({ p, data, sp }: { p: any; data: any, sp: any }) => {
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
        onClick={() => router.push(`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageStudents/${item.node.id}/?user=${item.node.customuser.id}`)}
        className="bg-green-200 p-2 rounded-full"
      >
        <FaRightLong color="green" size={21} />
      </button>,
    },
  ];

  return (
    <DefaultLayout
      pageType='admin'
      domain={p.domain}
      // downloadComponent={<ExcelExporter
      //   data={data?.allUserProfiles?.edges}
      //   title="ClassList"
      //   type="UserProfile"
      //   page="list_student_specialty"
      //   sp={sp}
      // />}
      searchComponent={
        <SearchMultiple
          names={['fullName', 'specialtyName', 'level', 'sex', 'academicYear']}
          link={`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageStudents`}
          select={[
            // { type: 'select', name: 'sex', dataSelect: ['MALE', 'FEMALE'] },
            // { type: 'select', name: 'academicYear', dataSelect: data?.allAcademicYears },
          ]}
        />
      }
      sidebar={
        <Sidebar
          params={p}
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

      <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">
        <Link
          className='rounded-lg shadow-lg bg-teal-50 px-4 py-2 cursor-pointer flex items-center justify-end gap-2 font-bold text-xl'
          href={`/${p.locale}/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageStudents/Admit`}
        >
          <span>{t("New Student")}</span>
          <button className='bg-green-500 p-1 rounded-full'><FaPlus size={25} color="white" /></button>
        </Link>

        {data ? (
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
        }


      </div>
    </DefaultLayout>
  );
};

export default List;