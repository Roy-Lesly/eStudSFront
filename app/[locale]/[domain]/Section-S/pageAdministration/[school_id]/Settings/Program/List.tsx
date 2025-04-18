'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa'; // Importing icons
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { EdgeProgramSec, NodeProgramSec } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ServerError from '@/ServerError';
import { gql, useMutation } from '@apollo/client';
import Modal from './Modal';
import { decodeUrlID } from '@/functions';
import Search from '@/section-s/Search/Search';
import ButtonAction from '@/section-s/Buttons/ButtonAction';



const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<any>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setActionType('add'); // Set the action type for the modal
    setModalOpen(true); // Open the modal
  };


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
            <Search
              name='name'
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Program`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Program"
        subRoute="List"
        pageName="Programs"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Program/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Program/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-4">
        <button
          onClick={openModal}
          className="bg-blue-600 flex focus:outline-none gap-2 hover:bg-blue-700 items-center px-4 py-2 rounded text-white"
        >
          <FaPlus /> Add Program
        </button>

        {data ? (
          data.allProgramSec.edges.length ? (
            <DataTable data={data?.allProgramSec?.edges} />
          ) : (
            <ServerError type="notFound" item="Programs" />
          )
        ) : (
          <ServerError type="network" item="Programs" />
        )}




        {modalOpen && (
          <Modal
            setModalOpen={setModalOpen}
          />
        )}



      </div>
    </DefaultLayout>
  );
};

export default List;

const DataTable = ({ data }: { data: EdgeProgramSec[] }) => {

  const [updateSubject] = useMutation(UPDATE_SUBJECT);
  const [deleteSubject] = useMutation(DELETE_SUBJECT);
  const handleDelete = async (item: NodeProgramSec) => {
    const confirmDeletion = window.confirm(`Are you sure you want to delete ${item.name}`);
    if (!confirmDeletion) {
      return;
    }
    try {
      await deleteSubject({ variables: { id: parseInt(decodeUrlID(item.id)) } });
      alert(`${item.name} - Successfully Deleted`)
      window.location.reload()
    } catch (error) {
      alert(`Error deleting:", ${item.name}`);
    }
  };

  const handleEdit = async (item: NodeProgramSec) => {
    const newName = window.prompt(
      `Update Subject Name (current: ${item.name}):`,
      item.name 
    ); 
    const newDescription = window.prompt(
      `Update Subject Name (current: ${item.description}):`,
      item.description 
    ); 
    const confirmEditing = window.confirm(
      `Are you sure you want to update to "${newName}"?`
    );
    if (!newName || newName.trim() === item.name.trim()) {
      alert("No changes were made.");
      return;
    }
    try {
      
  
      if (!confirmEditing) {
        return; 
      }
      await updateSubject({ variables: { 
        id: parseInt(decodeUrlID(item.id)),
        name: newName,
        description: newDescription,
      } });
      alert(`${item.name} - Successfully Updated`)
      window.location.reload()
    } catch (error) {
      alert(`Error Updating:", ${item.name}`);
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
            <th className="italic px-1 py-2 text-left text-lg tracking-wide w-1/2">Program</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide w-1/3">Description</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item: EdgeProgramSec, index: number) => (
            <motion.tr
              key={item.node.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="border-b text-black"
            >
              <td className="px-1 py-2 text-left">{index + 1}</td>
              <td className="px-1 py-2 text-left">{item.node.name}</td>
              <td className="px-1 py-2 text-left">{item.node.description}</td>
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





const UPDATE_SUBJECT = gql`
  mutation UpdateProgramSec($id: Int!, $name: String!, $description: String) {
    updateProgramSec(id: $id, name: $name, description: $description) {
      programSec {
        id
        name
        description
      }
    }
  }
  `;


const DELETE_SUBJECT = gql`
  mutation DeleteProgramSec($id: Int!) {
    deleteProgramSec(id: $id) {
      success
    }
  }
  `;