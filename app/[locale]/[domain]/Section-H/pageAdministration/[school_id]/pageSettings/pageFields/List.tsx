'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { EdgeDomain, EdgeField } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import MyModal from '@/MyModals/MyModal';
import ModalCUDField from '@/MyModals/ModalCUDField';
import ButtonAction from '@/section-h/Buttons/ButtonAction';


export const metadata: Metadata = {
  title: "Fields Page",
  description: "This is Fields Page Admin Settings",
};

const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
  const [selectedItem, setSelectedItem] = useState<EdgeField | null>(null);

  const Columns: TableColumn<EdgeField>[] = [
    { header: "#", align: "center", render: (_item: EdgeField, index: number) => index + 1, },
    { header: "Field Name", accessor: "node.fieldName", align: "left" },
    { header: "Domain", accessor: "node.domain.domainName", align: "left" },

    {
      header: "View", align: "center", render: (item) => <div className='flex flex-row gap-2 justify-center'>
      <ButtonAction data={item} type='edit' action={() => {setShowModal({ show: true, type: "update"}); setSelectedItem(item) }} />
      <ButtonAction data={item} type='delete' action={() => {setShowModal({ show: true, type: "delete"}); setSelectedItem(item) }} />
    </div>,
    },
  ];
  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={['fieldName']}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields`}
          select={[
            {
              type: 'searchAndSelect',
              name: 'domainName',
              dataSelect: data?.allDomains?.edges?.map((item: EdgeDomain) => item.node?.domainName),
            },
          ]}
        />
      }
      sidebar={
        <Sidebar
          params={params}
          menuGroups={getMenuAdministration(params)}
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
        department="Fields"
        subRoute="List"
        pageName="Fields"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/${params.profile_id}`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/${params.profile_id}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ?
            data?.allFields?.edges.length ?
              <MyTableComp
                data={
                  data?.allFields?.edges.sort((a: EdgeField, b: EdgeField) => {
                    const fieldNameA = a.node?.fieldName.toLowerCase();
                    const fieldNameB = b.node?.fieldName.toLowerCase();
                    return fieldNameA.localeCompare(fieldNameB);
                  })}
                columns={Columns} table_title='Fields'
                button_type={"add"}
                button_action={() => { setShowModal({ type: "create", show: true }) }}
              />
              :
              <ServerError type='notFound' item='Fields' />
            :
            <ServerError type='network' item='' />}
        </div>


        <MyModal
          component={<ModalCUDField
            params={params}
            setOpenModal={setShowModal}
            actionType={showModal?.type || "create"}
            selectedItem={selectedItem}
            domains={data?.allDomains?.edges}
          />}
          openState={showModal?.show || false}
          onClose={() => setShowModal({ show: false, type: "create"})}
          title={showModal?.type || ""}
          classname=''
        />

      </div>
    </DefaultLayout>
  );
};

export default List;

