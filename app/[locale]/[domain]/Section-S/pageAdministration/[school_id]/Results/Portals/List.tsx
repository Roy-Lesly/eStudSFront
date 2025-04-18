'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Importing icons
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import Modal from './Modal';
import { Metadata } from 'next';
import ButtonAction from '@/section-s/Buttons/ButtonAction';
import SearchMultiple from '@/section-s/Search/SearchMultiple';
import { EdgePublishSecondary, NodePublishSecondary } from '@/Domain/schemas/interfaceGraphqlSecondary';

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
      return {}; // Return empty object if parsing fails
    }
  }
  return data; // If already an object, just return it as-is
};

const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      domain={params.domain}
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
            <SearchMultiple
              names={['academicYear', 'level', 'stream']}
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Results/Portals`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Portals"
        subRoute="List"
        pageName="Portals"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Results/Portals/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Results/Portals/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">

        {/* <ComingSoon />     */}


        {data ? (
          data.allPublishSecondary.edges.length ? (
            <DataTable data={data?.allPublishSecondary?.edges} params={params} />
          ) : (
            <ServerError type="notFound" item="Users" />
          )
        ) : (
          <ServerError type="network" item="Users" />
        )}

      </div>
    </DefaultLayout>
  );
};

export default List;

const DataTable = ({ data, params }: { data: EdgePublishSecondary[], params: any }) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [dataUpdate, setDataUpdate] = useState<NodePublishSecondary>()

  const handleEdit = async (item: NodePublishSecondary) => {
    setDataUpdate(item)
    setOpenModal(true)
  };

  return (
    <div className="border overflow-x-auto relative w-full">
      <motion.table
        className="border-collapse min-w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">#</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide w-1/5">Class</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Term</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Portal</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item: EdgePublishSecondary, index: number) => (
              <motion.tr
                key={item.node.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="border-b text-black"
              >
                <td className="px-1 py-2 text-left">{index + 1}</td>
                <td className="px-1 py-2 text-left w-1/3">
                  {item.node.classroom.level.level} - {item.node.classroom.academicYear} - {item.node.classroom.stream}
                </td>
                <td className="px-1 py-2 text-left">{item.node.publishTerm}</td>
                <td className="px-1 py-2 text-left w-1/3">
                  <div className="flex flex-row gap-2 md:gap-10">
                    {item.node.portalSeq ? (
                      Object.keys(parseJson(item.node.portalSeq)).map((seqKey) => (
                        <div key={seqKey} className="flex gap-1 items-center">
                          {parseJson(item.node.portalSeq)[seqKey] ? (
                            <FaCheck className="text-green-500" />
                          ) : (
                            <FaTimes className="text-red" />
                          )}
                          <span>{`Sequence ${seqKey.split('_')[1]}`}</span>
                        </div>
                      ))
                    ) : (
                      <FaTimes className="text-red" />
                    )}
                  </div>
                </td>
                <td className="flex flex-row gap-2 px-1 py-2">
                  <ButtonAction type="next" action={() => handleEdit(item.node)} data={item.node} />
                </td>

              </motion.tr>
            ))}
        </tbody>
      </motion.table>

      {dataUpdate && openModal ?
        <Modal params={params} dataUpdate={dataUpdate} setOpenModal={setOpenModal} type="portal" />
        :
        null
      }
    </div>
  );
};







