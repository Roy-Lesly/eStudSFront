'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { gql, useMutation } from '@apollo/client';
import { decodeUrlID } from '@/functions';
import { Metadata } from 'next';
import { EdgeCustomUser, NodeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import ButtonAction from '@/section-s/Buttons/ButtonAction';
import SearchMultiple from '@/section-s/Search/SearchMultiple';
import ComingSoon from '@/ComingSoon';

export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "This is Main-Subject Page Admin Settings",
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
              names={['fullName', 'telephone']}
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Users`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Performance"
        subRoute="List"
        pageName="Performance"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Results/Performance/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Results/Performance/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


              <ComingSoon />    
        
{/* 
        {data ? (
          data.allCustomUsers.edges.length ? (
            <DataTable data={data?.allCustomUsers?.edges} />
          ) : (
            <ServerError type="notFound" item="Users" />
          )
        ) : (
          <ServerError type="network" item="Users" />
        )} */}



      </div>
    </DefaultLayout>
  );
};

export default List;

const DataTable = ({ data }: { data: EdgeCustomUser[] }) => {

  const [updateSubject] = useMutation(UPDATE_DATA);
  const [deleteSubject] = useMutation(DELETE_DATA);
  const handleDelete = async (item: NodeCustomUser) => {
    const confirmDeletion = window.confirm(`Are you sure you want to delete ${item.fullName}`);
    if (!confirmDeletion) {
      return;
    }
    try {
      await deleteSubject({ variables: { id: parseInt(decodeUrlID(item.id)) } });
      alert(`${item.fullName} - Successfully Deleted`)
      window.location.reload()
    } catch (error) {
      alert(`Error deleting:", ${item.fullName}`);
    }
  };

  const handleEdit = async (item: NodeCustomUser) => {
    const newSubjectName = window.prompt(
      `Update (current: ${item.fullName}):`,
      item.fullName 
    ); 
    if (!newSubjectName || newSubjectName.trim() === item.fullName.trim()) {
      alert("No changes were made.");
      return;
    }
    try {
      const confirmEditing = window.confirm(
        `Are you sure you want to update the subject name to "${newSubjectName}"?`
      );
  
      if (!confirmEditing) {
        return; 
      }
      await updateSubject({ variables: { 
        id: parseInt(decodeUrlID(item.id)),
        subjectName: newSubjectName,
      } });
      alert(`${item.fullName} - Successfully Updated`)
      window.location.reload()
    } catch (error) {
      alert(`Error Updating:", ${item.fullName}`);
    }
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
            <th className="italic px-1 py-2 text-left text-lg tracking-wide w-1/5">Full Name</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Gender</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Telephone</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Address</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">DOB / POB</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Email</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item: EdgeCustomUser, index: number) => (
            <motion.tr
              key={item.node.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="border-b text-black"
            >
              <td className="px-1 py-2 text-left">{index + 1}</td>
              <td className="px-1 py-2 text-left">{item.node.fullName}</td>
              <td className="px-1 py-2 text-left">{item.node.sex}</td>
              <td className="px-1 py-2 text-left">{item.node.telephone}</td>
              <td className="px-1 py-2 text-left">{item.node.address}</td>
              <td className="px-1 py-2 text-left">{item.node.dob}/{item.node.pob}</td>
              <td className="px-1 py-2 text-left">{item.node.email}</td>
              <td className="flex flex-row gap-2 px-1 py-2">
                <ButtonAction type="edit" action={handleEdit} data={item.node} />
                <ButtonAction type="delete" action={handleDelete} data={item.node} />
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