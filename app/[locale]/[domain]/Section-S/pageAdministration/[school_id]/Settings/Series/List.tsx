'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa'; // Importing icons
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { EdgeMainSubject, EdgeSeries, NodeSeries } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ServerError from '@/ServerError';
import { gql, useMutation } from '@apollo/client';
import Modal from './Modal';
import { decodeUrlID } from '@/functions';
import Search from '@/section-s/Search/Search';
import ButtonAction from '@/section-s/Buttons/ButtonAction';



const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [mainSubjects, setMainSubjects] = useState<{id: number, name: string}[]>();

  const openModal = () => {
    setModalOpen(true); // Open the modal
  };

    useEffect(() => {
      if (data && data.allMainSubjects?.edges){
        const f = data.allMainSubjects.edges.map((item: EdgeMainSubject) => {
          return {"id": decodeUrlID(item.node.id), "name": item.node.subjectName}
        })
        if (f){ setMainSubjects(f)}
      }
    }, [ data ])


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
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Series`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Series"
        subRoute="List"
        pageName="Series"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Series/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Series/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-4">
        <button
          onClick={openModal}
          className="bg-blue-600 flex focus:outline-none gap-2 hover:bg-blue-700 items-center px-4 py-2 rounded text-white"
        >
          <FaPlus /> Add Series
        </button>

        {data ? (
          data.allSeries.edges.length ? (
            <DataTable data={data?.allSeries?.edges} />
          ) : (
            <ServerError type="notFound" item="Series" />
          )
        ) : (
          <ServerError type="network" item="Series" />
        )}




        {modalOpen && mainSubjects && (
          <Modal
            setModalOpen={setModalOpen}
            mainSubjects={mainSubjects}
          />
        )}



      </div>
    </DefaultLayout>
  );
};

export default List;

const DataTable = ({ data }: { data: EdgeSeries[] }) => {

  const [updateSubject] = useMutation(UPDATE_DATA);
  const [deleteSubject] = useMutation(DELETE_DATA);
  const handleDelete = async (item: NodeSeries) => {
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

  const handleEdit = async (item: NodeSeries) => {
    const newName = window.prompt(
      `Update Subject Name (current: ${item.name}):`,
      item.name 
    ); 
    // const newDescription = window.prompt(
    //   `Update Subject Name (current: ${item.description}):`,
    //   item.description 
    // ); 
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
        // description: newDescription,
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
            <th className="italic px-1 py-2 text-left text-lg tracking-wide w-1/4">Series</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide w-2/3">Subjects</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item: EdgeSeries, index: number) => (
            <motion.tr
              key={item.node.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="border-b text-black"
            >
              <td className="px-1 py-2 text-left">{index + 1}</td>
              <td className="px-1 py-2 text-left">{item.node.name}</td>
              <td className="gap-2 px-1 py-2 text-left">
                {item.node.subjects?.edges?.map((item: EdgeMainSubject) => <span className='font-medium italic' key={item.node.id}>{item.node.subjectName}, </span>)}
              </td>
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
  mutation UpdateSeries($id: Int!, $name: String!, $description: String) {
    updateSeries(id: $id, name: $name, description: $description) {
      programSec {
        id
        name
        description
      }
    }
  }
  `;


const DELETE_DATA = gql`
  mutation DeleteSeries($id: Int!) {
    deleteSeries(id: $id) {
      success
    }
  }
  `;