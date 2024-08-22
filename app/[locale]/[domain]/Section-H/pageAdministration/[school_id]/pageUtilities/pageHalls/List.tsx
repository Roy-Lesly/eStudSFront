'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import SearchMultiple from '@/Search/SearchMultiple';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/components/Table/MyTableComp';
import { EdgeCustomUser, EdgeHall } from '@/Domain/schemas/interfaceGraphql';
import MyModal from '@/MyModals/MyModal';
import ModalCUDHall from '@/MyModals/ModalCUDHall';
import { FaRightLong } from 'react-icons/fa6';


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

const List = ({ params, data }: { params: any; data: any, searchParams: any }) => {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeHall | null>(null);



  const Columns: TableColumn<EdgeHall>[] = [
    { header: '#', align: 'left', render: (_item: EdgeHall, index: number) => index + 1, responsiveHidden: true },
    { header: 'Name', accessor: 'node.name', align: 'left', },
    { header: 'Capacity', accessor: 'node.capacity', align: 'right', },
    { header: 'Campus', accessor: 'node.school.campus', align: 'center', },
    {
      header: 'Select',
      align: 'center',
      render: (item: EdgeHall) => (
        <button
          onClick={() => { setShowModal({ type: "update", show: true }); setSelectedItem(item) }}
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
        names={['name']}
        link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pageHalls`}
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

        {data ? <MyTableComp
          data={data}
          columns={Columns}
          table_title='Halls'
          button_type={"add"}
          button_action={() => { setShowModal({ type: "create", show: true }) }}
        />
          :
          <ServerError type="network" item="Users" />
        }


        <MyModal
          component={<ModalCUDHall
            params={params}
            setOpenModal={setShowModal}
            actionType={showModal?.type || "create"}
            selectedItem={selectedItem}
          />}
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


