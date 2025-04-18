'use client';

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; // Importing icons
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { EdgeMainSubject, NodeMainSubject } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ServerError from '@/ServerError';
import { gql, useMutation } from '@apollo/client';
import Modal from './Modal';
import { decodeUrlID } from '@/functions';
import { Metadata } from 'next';
import ButtonAction from '@/section-s/Buttons/ButtonAction';
import Search from '@/section-s/Search/Search';
import MyTableComp from '@/section-s/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';

export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "This is Main-Subject Page Admin Settings",
};

const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
              name="subjectName"
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/SubjectList`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Subject"
        subRoute="List"
        pageName="Subjects"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Subject/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Subject/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-4">
        {/* Add Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 flex focus:outline-none gap-2 hover:bg-blue-700 items-center px-4 py-2 rounded text-white"
        >
          <FaPlus /> Add Subject
        </button>

        {data ? (
          data.allMainSubjects.edges.length ? (
            <DataTable data={data?.allMainSubjects?.edges} />
          ) : (
            <ServerError type="notFound" item="Subject" />
          )
        ) : (
          <ServerError type="network" item="Subject" />
        )}

        {modalOpen && <Modal setModalOpen={setModalOpen} />}
      </div>
    </DefaultLayout>
  );
};

export default List;

const DataTable = ({ data }: { data: EdgeMainSubject[] }) => {
  const [updateSubject] = useMutation(UPDATE_SUBJECT);
  const [deleteSubject] = useMutation(DELETE_SUBJECT);

  const handleDelete = async (item: NodeMainSubject) => {
    const confirmDeletion = window.confirm(`Are you sure you want to delete ${item.subjectName}`);
    if (!confirmDeletion) return;
    try {
      await deleteSubject({ variables: { id: parseInt(decodeUrlID(item.id)) } });
      alert(`${item.subjectName} - Successfully Deleted`);
      window.location.reload();
    } catch (error) {
      alert(`Error deleting: ${item.subjectName}`);
    }
  };

  const handleEdit = async (item: NodeMainSubject) => {
    const newSubjectName = window.prompt(`Update Subject Name (current: ${item.subjectName}):`, item.subjectName.toUpperCase());
    if (!newSubjectName || newSubjectName.trim() === item.subjectName.trim()) {
      alert("No changes were made.");
      return;
    }
    try {
      const confirmEditing = window.confirm(`Are you sure you want to update the subject name to "${newSubjectName}"?`);
      if (!confirmEditing) return;
      await updateSubject({ variables: { id: parseInt(decodeUrlID(item.id)), subjectName: newSubjectName } });
      alert(`${item.subjectName} - Successfully Updated`);
      window.location.reload();
    } catch (error) {
      alert(`Error Updating: ${item.subjectName}`);
    }
  };

  const columns: TableColumn<EdgeMainSubject>[] = [
    { header: '#', align: 'center', render: (_item: EdgeMainSubject, index: number) => index + 1 },
    { header: 'Subject Name', accessor: 'node.subjectName', align: 'left' },
    {
      header: 'Action', align: 'center', render: (item) => (
        <div className="flex gap-2 justify-center md:gap-6">
          <ButtonAction type="edit" action={handleEdit} data={item.node} />
          <ButtonAction type="delete" action={handleDelete} data={item.node} />
        </div>
      ),
    },
  ];

  return (
    <div className="border overflow-x-auto relative w-full">
      <MyTableComp
        data={data} 
        columns={columns}
        rowKey={(item, index) => item.node.id || index}
      />
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
