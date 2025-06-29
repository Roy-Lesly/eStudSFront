'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { EdgeTimeTable } from '@/Domain/schemas/interfaceGraphql';
import { useRouter } from 'next/navigation';
import { FaRightLong } from 'react-icons/fa6';
import MyModal from '@/MyModals/MyModal';


export const metadata: Metadata = {
  title: "Users Page",
  description: "This is Users Page Admin Settings",
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

const List = ({ params, dataAllTimeTables, searchParams }: { params: any; dataAllTimeTables: any, searchParams: any }) => {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "create" | "edit" }>({ show: false, type: "create" });
  const router = useRouter();

  const Columns: TableColumn<EdgeTimeTable>[] = [
    { header: '#', align: 'left', render: (_item: EdgeTimeTable, index: number) => index + 1, responsiveHidden: true },
    {
      header: 'Specialty', align: 'left',
      render: (item: EdgeTimeTable, index: number) => <div className='flex gap-1 flex-row w-full'>
        <span className='w-full'>{item.node.specialty.mainSpecialty.specialtyName}</span>
        <span>{item.node.specialty.academicYear}-</span>
        <span>{item.node.specialty.level.level}</span>
      </div>
    },
    {
      header: 'Year / Month', align: 'left',
      render: (item: EdgeTimeTable, index: number) => <div className='flex gap-2 flex-row w-full'>
        <span>{item.node.year}</span>
        <span>-</span>
        <span>{item.node.monthName}</span>
      </div>
    },
    {
      header: 'Published', align: 'center', responsiveHidden: true,
      render: (item: EdgeTimeTable, index: number) => <div className='flex gap-2'>
        {item.node.published ? <span>True</span> : <span>False</span>}
      </div>,
    },
    {
      header: 'Select',
      align: 'center',
      render: (item: EdgeTimeTable) => (
        <button
          onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${item.node.id}?spec=${item.node.specialty.id}`)}
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
      searchComponent={<SearchMultiple
        names={['specialtyName', "year", "month"]}
        link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable`}
        select={[
          // { type: 'select', name: 'sex', dataSelect: ['MALE', 'FEMALE'] },
        ]}
      />}
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

      <div className="bg-gray-50 flex flex-col items-center justify-center">

        <div className='flex flex-col gap-2 w-full'>
          <MyTableComp
            data={dataAllTimeTables}
            columns={Columns}
            table_title='TimeTable'
            rowKey={(item, index) => item.node.id || index}
            button_type="add"
            button_action={() => setShowModal({ show: true, type: "create" })}
          />
        </div>

        <MyModal
          component={<ModalInfo params={params} />}
          openState={showModal?.show || false}
          onClose={() => setShowModal({ show: false, type: "create" })}
          title={showModal?.type || ""}
          classname=''
        />

      </div>
    </DefaultLayout >
  );
};

export default List;

const ModalInfo = ({ params }: any) => {

  const router = useRouter();
  return (
    <div className="flex items-center justify-center bg-gray-200">
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Welcome to the TimeTable Creation Process
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          On the next page, you will be expected to select a class in order to create a timetable.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Please make sure to choose the correct class, as the timetable you create will be associated with it.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          If you need further assistance, feel free to reach out to our support team.
        </p>

        <button
          className="w-full px-6 py-2 bg-red text-white font-bold tracking-widest rounded-lg shadow-md hover:bg-red transition duration-300"
          onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/CreateTimeTable`)}
        >
          Next
        </button>
      </div>
    </div>
  );
};




