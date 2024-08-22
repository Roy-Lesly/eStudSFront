'use client';

import React, { FC, useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { EdgeDomain, EdgeLevel, EdgeSpecialty } from '@/Domain/schemas/interfaceGraphql';
import { FaRightLong } from 'react-icons/fa6';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import SearchMultiple from '@/Search/SearchMultiple';
import { useRouter } from 'next/navigation';
import { addOneYear } from '@/functions';


export const metadata: Metadata = {
  title: "Fields Page",
  description: "e-conneq School System. Fields Page Admin Settings",
};

const List = ({ params, data }: { params: any; data: any, searchParams: any }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const Columns: TableColumn<EdgeSpecialty>[] = [
    { header: "#", align: "center", render: (_item: EdgeSpecialty, index: number) => index + 1, },
    { header: "Specialty Name", accessor: "node.mainSpecialty.specialtyName", align: "left" },
    { header: "Year", accessor: "node.academicYear", align: "center" },
    { header: "level", accessor: "node.level.level", align: "center" },
    {
      header: "View", align: "center",
      render: (item) => <button
        onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote/${item.node.id}/?next=${item.node.level.level + 100}&spec=${item.node.mainSpecialty.specialtyName}&dom=${item.node.mainSpecialty.field.domain.id}&nextYear=${addOneYear(item.node.academicYear)}`)}
        className="bg-green-200 p-1 rounded-full"
      >
        <FaRightLong color="green" size={21} />
      </button>,
    },
  ];

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={['specialtyName']}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote`}
          select={[
            { type: 'select', name: 'academicYear', dataSelect: data?.allAcademicYears.slice(1) },
            { type: 'select', name: 'level', dataSelect: data?.allLevels.edges.map((item: EdgeLevel) => item.node.level) },
            {
              type: 'searchAndSelect',
              name: 'domainName',
              dataSelect: data?.allDomains?.edges?.map((item: EdgeDomain) => item.node.domainName),
            },
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
        department="Promotion"
        subRoute="List"
        pageName="Promotion - Select Class"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Result/pagePromote/${params.profile_id}`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Result/pagePromote/${params.profile_id}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ? (
            data?.allSpecialties?.edges.length ?
              <MyTableComp
                data={
                  data?.allSpecialties?.edges.sort((a: EdgeSpecialty, b: EdgeSpecialty) => {
                    const specialtyNameA = a.node.mainSpecialty.specialtyName.toLowerCase();
                    const specialtyNameB = b.node.mainSpecialty.specialtyName.toLowerCase();
                    const levelA = a.node.level.level;
                    const levelB = b.node.level.level;
                    if (specialtyNameA > specialtyNameB) return 1;
                    if (specialtyNameA < specialtyNameB) return -1;
                    if (levelA > levelB) return 1;
                    if (levelA < levelB) return -1;
                  })}
                columns={Columns}
              />
              :
              <ServerError type="notFound" item="Classes" />
          ) : (
            <ServerError type="network" item="Promotion" />
          )}
        </div>

      </div>
    </DefaultLayout>
  );
};

export default List;

