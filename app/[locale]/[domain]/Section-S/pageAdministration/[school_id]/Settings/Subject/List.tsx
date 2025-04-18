'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa'; // Importing icons
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { EdgeClassRoom, EdgeMainSubject, EdgeSubject, NodeSubject } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ServerError from '@/ServerError';
import { gql, useMutation } from '@apollo/client';
import Modal from './Modal';
import { decodeUrlID } from '@/functions';
import SearchSubject from '@/section-s/Search/SearchSubject';
import { Metadata } from 'next';
import ButtonAction from '@/section-s/Buttons/ButtonAction';

export const metadata: Metadata = {
  title: "Assigned Subjects Page",
  description: "This is Assigned Subjects Page Admin Settings",
};


const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<any>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [mainSubjects, setMainSubjects] = useState<{id: number, name: string}[]>();
  const [classrooms, setClassrooms] = useState<{id: number, name: string}[]>();

  const openModal = () => {
    setActionType('add');
    setModalOpen(true);
  };

  useEffect(() => {
    if (data && data.allClassrooms?.edges){
      const f = data.allClassrooms.edges.map((item: EdgeClassRoom) => {
        return {"id": decodeUrlID(item.node.id), "name": `${item.node.level.level}-${item.node.academicYear}-${item.node.stream}`, }
      })
      if (f){ setClassrooms(f)}
      console.log(f, 35)

    }
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
            <SearchSubject
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Subject`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Assigned Subjects"
        subRoute="List"
        pageName="Subjects"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Subject/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Subject/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-4">
        {/* Add Button */}
        {mainSubjects && classrooms ? <button
          onClick={openModal}
          className="bg-blue-600 flex focus:outline-none gap-2 hover:bg-blue-700 items-center px-4 py-2 rounded text-white"
        >
          <FaPlus /> Assign Subject
        </button> : <div>No Classrooms or Main Subject</div>}

        {data ? (
          data.allSubjects.edges.length ? (
            <DataTable data={data?.allSubjects?.edges} />
          ) : (
            <ServerError type="notFound" item="Subject" />
          )
        ) : (
          <ServerError type="network" item="Subject" />
        )}




        {modalOpen && mainSubjects && classrooms && (
          <Modal
            setModalOpen={setModalOpen}
            mainSubjects={mainSubjects} 
            classrooms={classrooms}
          />
        )}



      </div>
    </DefaultLayout>
  );
};

export default List;

const DataTable = ({ data }: { data: EdgeSubject[] }) => {

  const [updateSubject] = useMutation(UPDATE_SUBJECT);
  const [deleteSubject] = useMutation(DELETE_SUBJECT);
  const handleDelete = async (item: NodeSubject) => {
    const confirmDeletion = window.confirm(`Are you sure you want to delete ${item.mainSubject.subjectName}`);
    if (!confirmDeletion) {
      return;
    }
    try {
      await deleteSubject({ variables: { id: parseInt(decodeUrlID(item.id)) } });
      alert(`${item.mainSubject.subjectName} - Successfully Deleted`)
      window.location.reload()
    } catch (error) {
      alert(`Error deleting:", ${item.mainSubject.subjectName}`);
    }
  };

  const handleEdit = async (item: NodeSubject) => {
    const newSubjectName = window.prompt(
      `Update Subject Name (current: ${item.mainSubject.subjectName}):`,
      item.mainSubject.subjectName 
    ); 
    if (!newSubjectName || newSubjectName.trim() === item.mainSubject.subjectName.trim()) {
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
      alert(`${item.mainSubject.subjectName} - Successfully Updated`)
      window.location.reload()
    } catch (error) {
      alert(`Error Updating:", ${item.mainSubject.subjectName}`);
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
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Code</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide w-1/3">Subject Name</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Coef</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Type</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Assigned</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item: EdgeSubject, index: number) => (
            <motion.tr
              key={item.node.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="border-b text-black"
            >
              <td className="px-1 py-2 text-left">{index + 1}</td>
              <td className="px-1 py-2 text-left">{item.node.subjectCode}</td>
              <td className="px-1 py-2 text-left">{item.node.mainSubject.subjectName}</td>
              <td className="px-1 py-2 text-left">{item.node.subjectCoefficient}</td>
              <td className="px-1 py-2 text-left">{item.node.subjectType}</td>
              <td className="px-1 py-2 text-left">{item.node.assigned ? item.node.assignedTo.fullName : <span className="font-medium text-red">Not Assigned</span>}</td>
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
  mutation UpdateSubject($id: Int!, $subjectName: String!) {
    updateMainSubject(id: $id, subjectName: $subjectName) {
      mainSubject {
        id
        subjectName
      }
    }
  }
  `;


const DELETE_SUBJECT = gql`
  mutation DeleteSubject($id: Int!) {
    deleteMainSubject(id: $id) {
      success
    }
  }
  `;