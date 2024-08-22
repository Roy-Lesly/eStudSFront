'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-p/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import { Metadata } from 'next';
import SearchMultiple from '@/Search/SearchMultiple';
import { useRouter } from 'next/navigation';
import { FaRightLong } from 'react-icons/fa6';
import ExcelExporter from '@/ExcelExporter';
import ServerError from '@/ServerError';
import { useTranslation } from 'react-i18next';
import { EdgeUserProfilePrim, TableColumn } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import MyTableComp from '@/components/Table/MyTableComp';


const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  const Columns: TableColumn<EdgeUserProfilePrim>[] = [
    { header: "#", align: "center", render: (_item: EdgeUserProfilePrim, index: number) => index + 1, },
    {
      header: `${t("Student")}`, align: "left", responsiveHidden: true, render: (item) => <div className="flex flex-col">
        <span>{item.node.customuser?.firstName}</span>
        <span>{item.node.customuser?.lastName}</span>
      </div>,
    },
    {
      header: `${t("Parents Names")}`, align: "left", render: (item) => <div className="flex flex-col">
        <span>{item.node.customuser?.fatherName}</span>
        <span>{item.node.customuser?.motherName}</span>
      </div>,
    },
    {
      header: `${t("Parents Telephones")}`, align: "left", render: (item) => <div className="flex flex-col">
        <span>{item.node.customuser?.fatherTelephone}</span>
        <span>{item.node.customuser?.motherTelephone}</span>
      </div>,
    },
    {
      header: `${t("Class Info")}`, responsiveHidden: true, align: "left", render: (item) => <div className="flex flex-col">
        <span>{item.node.classroomprim?.level}</span>
        <span>{item.node.classroomprim?.academicYear}</span>
      </div>,
    },
    // { header: `${t("Class")}`, accessor: "node.stream", align: "left" },
    // { header: `${t("Section")}`, accessor: "node.classroomprim.stream", align: "left" },

    {
      header: `${t("View")}`, align: "center",
      render: (item) => <button
        onClick={() => router.push(`/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageUsers/parents/${item.node.id}/?user=${item.node.customuser.id}&ft=${item.node.customuser?.fatherTelephone}&mt=${item.node.customuser?.motherTelephone}`)}
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
      //   data={data?.allUserProfilesPrim?.edges}
      //   title="ClassList"
      //   type="UserProfile"
      //   page="list_student_specialty"
      //   searchParams={searchParams}
      // />}
      searchComponent={
        <SearchMultiple
          names={['fullName', 'level', 'sex', 'academicYear']}
          link={`/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageUsers/parents`}
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
      <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">

        {data ?
          <MyTableComp
            data={
              data.allUserprofilesPrim?.edges.sort((a: EdgeUserProfilePrim, b: EdgeUserProfilePrim) => {
                const academicYearA = a.node.classroomprim.academicYear;
                const academicYearB = b.node.classroomprim.academicYear;
                const fullNameA = a.node.customuser?.fatherName.toLowerCase();
                const fullNameB = b.node.customuser?.fatherName.toLowerCase();

                if (academicYearA > academicYearB) return -1;
                if (academicYearA < academicYearB) return 1;

                return fullNameA.localeCompare(fullNameB);
              })}
            columns={Columns}
            table_title={`${t("Parents List")}`}
          // button_action={() => router.push(`/${params.locale}/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageStudents/pageNewPreinscription`)}
          // button_type={"add"}
          />
          :
          <ServerError type="network" item="Parents" />
        }


      </div>
    </DefaultLayout>
  );
};

export default List;