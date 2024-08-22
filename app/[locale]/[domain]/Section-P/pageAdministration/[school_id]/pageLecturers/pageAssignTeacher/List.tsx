'use client';

import React, { useState } from 'react'; // Importing icons
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import { decodeUrlID } from '@/functions';
import SearchMultiple from '@/Search/SearchMultiple';
import DefaultLayout from '@/DefaultLayout';
import { EdgeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { NodeClassRoomPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';


const List = (
  { params, data, searchParams }:
    { params: any; data: any, searchParams: any }
) => {

  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={['fullName']}
          link={`/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageLecturers/pageAssignTeacher`}
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
          searchComponent={null}
        />
      }
    >

      <div className="bg-gray-50 flex flex-col items-center justify-center md:p-2">

        {data ?
          <div className="flex flex-col gap-2 w-full">
            <DataTable
              data={data.allCustomusers.edges.sort((a: EdgeCustomUser, b: EdgeCustomUser) => a.node.fullName > b.node.fullName ? 1 : a.node.fullName < b.node.fullName ? -1 : 0)}
              params={params}
            />
          </div>
          :
          <ServerError type="notFound" item="Teachers List" />
        }

      </div>
    </DefaultLayout>
  );
};

export default List;



const DataTable = ({ data, params }: { data: EdgeCustomUser[], params: any }) => {

  const router = useRouter();
  const { t } = useTranslation("common");

  const Columns: TableColumn<EdgeCustomUser>[] = [
    { header: "#", align: "center", responsiveHidden: true, render: (_item: EdgeCustomUser, index: number) => index + 1, },
    { header: `${t("Full Name")}`, accessor: "node.fullName", align: "left", },
    {
      header: `${t("Assigned Classes")}`, responsiveHidden: true, align: "left", render: (item: EdgeCustomUser) => <>
        {item.node.classroomprim?.map((c: NodeClassRoomPrim) => <div key={c.id} className='flex justify-between'>
          <span>{c?.level}</span>
          <span>{c?.academicYear}</span>
        </div>)}
      </>
    },
    {
      header: "Actions",
      align: "center",
      render: (item: EdgeCustomUser) => (
        <button
          onClick={() => router.push(`/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageLecturers/pageAssignTeacher/${item.node.id}`)}
          className="bg-green-200 p-2 rounded-full"
        >
          <FaRightLong color="green" size={23} />
        </button>
      ),
    },
  ];

  return <MyTableComp
    columns={Columns}
    data={data}
    rowKey={(item, index) => item.node.id || index}
  />
}
