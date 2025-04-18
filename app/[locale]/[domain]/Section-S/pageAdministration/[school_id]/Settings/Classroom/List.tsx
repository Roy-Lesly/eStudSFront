'use client'
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa'; // Importing icons
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { EdgeClassRoom, EdgeSecondaryLevel, NodeClassRoom, TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ServerError from '@/ServerError';
import { gql, useMutation } from '@apollo/client';
import Modal from './Modal';
import { decodeUrlID } from '@/functions';
import SearchMultiple from '@/section-s/Search/SearchMultiple';
import ButtonAction from '@/section-s/Buttons/ButtonAction';
import MyTableComp from '@/section-s/Table/MyTableComp';

const List = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [secondaryLevels, setSecondaryLevels] = useState<{ id: number, name: string }[]>();

  const openModal = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    if (data && data.allSecondaryLevels?.edges) {
      const f = data.allSecondaryLevels.edges.map((item: EdgeSecondaryLevel) => {
        return { "id": decodeUrlID(item.node.id), "name": item.node.level };
      });
      if (f) { setSecondaryLevels(f); }
    }
  }, [data]);

  const columns: TableColumn<EdgeClassRoom>[] = [
    {
      header: '#',
      align: "left",
      render: (_: EdgeClassRoom, index: number) => index + 1,
    },
    {
      header: 'Class',
      align: "left",
      accessor: 'node.level.level',
    },
    {
      header: 'Year',
      align: "left",
      accessor: 'node.academicYear',
    },
    {
      header: 'Section',
      align: "left",
      accessor: 'node.stream',
    },
    {
      header: 'Option',
      align: "left",
      accessor: 'node.option',
    },
    {
      header: 'Campus',
      align: "left",
      accessor: 'node.school.campus',
    },
    {
      header: 'Action',
      align: "center",
      render: (item: EdgeClassRoom) => (
        <div className="flex flex-row gap-2 justify-center">
          <ButtonAction type="edit" action={handleEdit} data={item.node} />
          <ButtonAction type="delete" action={handleDelete} data={item.node} />
        </div>
      ),
    },
  ]


  const [updateSubject] = useMutation(UPDATE_DATA);
  const [deleteSubject] = useMutation(DELETE_DATA);

  const handleDelete = async (item: NodeClassRoom) => {
    try {
      await deleteSubject({ variables: { id: parseInt(decodeUrlID(item.id)) } });
      // alert(`${item.mainSubject.subjectName} - Successfully Deleted`)
      window.location.reload();
    } catch (error) {
      // alert(`Error deleting:", ${item.mainSubject.subjectName}`);
    }
  };

  const handleEdit = async (item: NodeClassRoom) => {
    const newSubjectName = window.prompt(

    );

    try {
      const confirmEditing = window.confirm(
        `Are you sure you want to update the subject name to "${newSubjectName}"?`
      );

      if (!confirmEditing) {
        return;
      }
      await updateSubject({
        variables: {
          id: parseInt(decodeUrlID(item.id)),
          subjectName: newSubjectName,
        },
      });
      // alert(`${item.mainSubject.subjectName} - Successfully Updated`)
      window.location.reload();
    } catch (error) {
      // alert(`Error Updating:", ${item.mainSubject.subjectName}`);
    }
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
            <SearchMultiple
              names={['level', 'stream', 'academicYear']}
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Classroom`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Classrooms"
        subRoute="List"
        pageName="Classrooms"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Classroom/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Classroom/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-2">
        {/* Add Button */}
        <button
          onClick={openModal}
          className="bg-blue-600 flex focus:outline-none gap-2 hover:bg-blue-700 items-center px-4 py-2 rounded text-white"
        >
          <FaPlus /> Add Classroom
        </button>

        {data ? (
          data.allClassrooms.edges.length ? (
            <MyTableComp
              columns={columns}
              data={data.allClassrooms.edges}
              rowKey={(item) => item.node.id}
            />
          ) : (
            <ServerError type="notFound" item="Classroom" />
          )
        ) : (
          <ServerError type="network" item="Classroom" />
        )}

        {modalOpen && secondaryLevels && (
          <Modal
            params={params}
            setModalOpen={setModalOpen}
            secondaryLevels={secondaryLevels}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default List;

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
