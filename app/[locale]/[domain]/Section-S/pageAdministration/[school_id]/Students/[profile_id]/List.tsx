'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { gql } from '@apollo/client';
import { decodeUrlID } from '@/functions';
import { Metadata } from 'next';
import ButtonAction from '@/section-s/Buttons/ButtonAction';
import SearchMultiple from '@/section-s/Search/SearchMultiple';
import { EdgeUserprofileSec, NodeUserprofileSec } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { useRouter } from 'next/navigation';
import Info from './Info';
import Fees from './Fees';
import Results from './Results';
import Classes from './Classes';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';


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
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Students/${params.profile_id}`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Details"
        subRoute="List"
        pageName="Student Details"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/${params.profile_id}`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/${params.profile_id}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ? 
          data.allUserprofileSec ? 
          <Tabs
            tabs={[
              { label: 'Info', content: <Info data={data.allUserprofileSec.edges[0]} /> },
              { label: 'Classes', content: <Classes data={data.allClassroomsByUserProfileSec} /> },
              { label: 'Fees', content: <Fees data={data.allSchoolFeesSec?.edges[0]} /> },
              { label: 'Results', content: <Results data={data.allResultsSecondary?.edges} /> },
            ]}
          /> 
          : 
          <ServerError type='notFound' item='Student Info' />
          : 
          <ServerError type='network' item='' />}
        </div>

      </div>
    </DefaultLayout>
  );
};

export default List;


const Tabs = ({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div className="flex gap-1">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`relative flex-1 px-4 py-2 rounded text-center font-medium ${
              activeTab === index
                ? 'bg-blue-600 text-white text-lg uppercase tracking-widest font-semibold'
                : 'bg-blue-100 text-gray-700 hover:bg-blue-950 hover:text-white'
            } focus:outline-none transition duration-300 ease-in-out`}
          >
            {tab.label}

            {/* Active Indicator */}
            {activeTab === index && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bg-teal-500 bottom-0 h-1 left-0 right-0 rounded-t-md"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-100 p-4 rounded-b-lg"
      >
        {tabs[activeTab].content}
      </motion.div>
    </div>
  );
};


const DataTable = ({ data, params }: { data: EdgeUserprofileSec[], params: any }) => {
  const router = useRouter();

  const handleView = async (item: NodeUserprofileSec) => {
    router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Students/${decodeUrlID(item.id)}/Info`)
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