'use client';

import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import SearchMultiple from '@/Search/SearchMultiple';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/components/Table/MyTableComp';
import { EdgeSpecialty } from '@/Domain/schemas/interfaceGraphql';
import { useRouter } from 'next/navigation';
import { FaLeftLong, FaRightLong } from 'react-icons/fa6';
import MyModal from '@/MyModals/MyModal';
import ModalSelect from './ModalSelect';
import DrawTimeTable from './DrawTimeTable';


const List = ({ params, data }: { params: any; data: any }) => {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "create" | "edit" }>({ show: false, type: "create" });
  const [selectedData, setSelectedData] = useState<{ specialty: EdgeSpecialty, year: number, month: number, day: number }>()
  const [page, setPage] = useState<number>(1)

  const Columns: TableColumn<EdgeSpecialty>[] = [
    { header: '#', align: 'left', render: (_item: EdgeSpecialty, index: number) => index + 1, responsiveHidden: true },
    { header: 'Specialty', align: 'left', accessor: "node.mainSpecialty.specialtyName" },
    { header: 'Academic Year', align: 'left', accessor: "node.academicYear" },
    { header: 'Level', align: 'left', accessor: "node.level.level" },
    {
      header: 'Select',
      align: 'center',
      render: (item: EdgeSpecialty) => (
        <button
          onClick={() => { setSelectedData({ specialty: item, year: 0, month: 0, day: 0 }); setShowModal({ show: true, type: "create" }) }}
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
      searchComponent={<div className='flex gap-2 w-full items-center'>
        {page === 2 && <span onClick={() => setPage(1)} className='bg-red rounded-full p-2 mx-1'><FaLeftLong size={23} /></span>}
        {page === 1 && selectedData?.specialty && <span onClick={() => setPage(2)} className='bg-green-300 rounded-full p-2 mx-1'><FaRightLong size={23} /></span>}
        <SearchMultiple
          names={['specialtyName', "academicYear", "level"]}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/CreateTimeTable`}
        />
      </div>}
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

        {data && data.length ? null
          :
          <ServerError type='notFound' />
        }

        {page === 1 && data && data.length ? <div className='flex flex-col gap-2 w-full'>
          <MyTableComp
            data={data}
            columns={Columns}
            table_title='SPECIALTIES'
            rowKey={(item, index) => item.node.id || index}
          />
        </div> : null}

        {selectedData?.specialty ?
          <MyModal
            component={<ModalSelect
              params={params}
              selectedData={selectedData}
              setSelectedData={setSelectedData}
              setPage={setPage}
              onClose={() => setShowModal({ show: false, type: "create" })}
            />}
            openState={showModal?.show || false}
            onClose={() => setShowModal({ show: false, type: "create" })}
            title={showModal?.type || ""}
            classname=''
          /> : null}

        {page === 2 && selectedData?.specialty ? <DrawTimeTable
          params={params}
          query={selectedData}
        /> : null}

      </div>
    </DefaultLayout >
  );
};

export default List;




