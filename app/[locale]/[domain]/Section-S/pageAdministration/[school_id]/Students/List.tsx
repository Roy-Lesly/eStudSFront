'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { gql } from '@apollo/client';
import { decodeUrlID } from '@/functions';
import { Metadata } from 'next';
import ButtonAction from '@/section-s/Buttons/ButtonAction';
import SearchMultiple from '@/section-s/Search/SearchMultiple';
import { EdgeUserprofileSec, NodeUserprofileSec } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';


export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "This is Main-Subject Page Admin Settings",
};

const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();


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
              names={['fullName', 'telephone']}
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Students`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Students"
        subRoute="List"
        pageName="Students"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">

        <button
          onClick={() => router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Students/Admit`)}
          className="bg-blue-600 flex focus:outline-none gap-2 hover:bg-blue-700 items-center px-4 py-2 rounded text-white"
        >
          <FaPlus />Admit Studemt
        </button>

        {data ? (
          data.allUserprofileSec.edges.length ? (
            <DataTable data={data?.allUserprofileSec?.edges} params={params} />
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

const DataTable = ({ data, params }: { data: EdgeUserprofileSec[], params: any }) => {
  const router = useRouter();

  const handleView = async (item: NodeUserprofileSec) => {
    router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Students/${decodeUrlID(item.id)}`)
  };


  return (
    <div className="border mt-2 overflow-x-auto relative w-full">
      <motion.table
        className="border-collapse min-w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">#</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Matricle</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide w-1/4">Full Name</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Gender</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Telephone</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide w-1/4">Classroom</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item: EdgeUserprofileSec, index: number) => (
            <motion.tr
              key={item.node.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="border-b text-black"
            >
              <td className="px-1 py-2 text-left">{index + 1}</td>
              <td className="px-1 py-2 text-left">{item.node.user.matricle}</td>
              <td className="px-1 py-2 text-left">{item.node.user.fullName}</td>
              <td className="px-1 py-2 text-left">{item.node.user.sex}</td>
              <td className="px-1 py-2 text-left">{item.node.user.telephone}</td>
              <td className="px-1 py-2 text-left">{item.node.classroom.level.level} - {item.node.classroom.academicYear} - {item.node.classroom.stream}</td>
              <td className="flex flex-row gap-2 px-1 py-2">
                <ButtonAction type="next" action={handleView} data={item.node} />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

    </div>
  );
};





const UPDATE_DATA = gql`
  mutation UpdateSubject($id: Int!, $subjectName: String!) {
    updateMainSubject(id: $id, subjectName: $subjectName) {
      mainSubject {
        id
        subjectName
      }
    }
  }
  `;


const DELETE_DATA = gql`
  mutation DeleteSubject($id: Int!) {
    deleteMainSubject(id: $id) {
      success
    }
  }
  `;