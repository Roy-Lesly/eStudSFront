'use client';
import { FaPlus } from 'react-icons/fa'; // Importing icons
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { EdgeSecondaryLevel, NodeSecondaryLevel, TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ServerError from '@/ServerError';
import { gql, useMutation } from '@apollo/client';
import { decodeUrlID } from '@/functions';
import SearchMultiple from '@/section-s/Search/SearchMultiple';
import ButtonAction from '@/section-s/Buttons/ButtonAction';
import MyTableComp from '@/section-s/Table/MyTableComp';
import { useEffect, useState } from 'react';
import Modal from './ModalLevel';


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
        return { "id": decodeUrlID(item.node.id), "name": item.node.level }
      })
      if (f) { setSecondaryLevels(f) }
    }
  }, [data]);

    const [updateData] = useMutation(UPDATE_DATA);
    const [deleteData] = useMutation(DELETE_DATA);
  const handleDelete = async (item: NodeSecondaryLevel) => {
    try {
      await deleteData({ variables: { id: parseInt(decodeUrlID(item.id)) } });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };
  
  const handleEdit = async (item: NodeSecondaryLevel) => {
    const newSubjectName = window.prompt('Update Subject Name:');
    if (!newSubjectName) {
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
  
      await updateData({
        variables: {
          id: parseInt(decodeUrlID(item.id)),
          subjectName: newSubjectName,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const columns: TableColumn<EdgeSecondaryLevel>[] = [
    { header: "#", align: "left", render: (item: EdgeSecondaryLevel, index: number) => index + 1 },
    { header: "Level", accessor: "node.level", align: "left" },
    {
      header: "Action", align: "center",
      render: (item: EdgeSecondaryLevel) => (
        <div className="flex flex-row gap-4">
          <ButtonAction type="edit" action={() => handleEdit(item.node)} data={item.node} />
          <ButtonAction type="delete" action={() => handleDelete(item.node)} data={item.node} />
        </div>
      )
    }
  ]
  
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
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Level`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Level"
        subRoute="List"
        pageName="Level"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Level/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Level/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center py-2 space-y-2">
        {/* Add Button */}
        <button
          onClick={openModal}
          className="bg-blue-600 flex focus:outline-none gap-2 hover:bg-blue-700 items-center px-4 py-2 rounded text-white"
        >
          <FaPlus /> Add Level
        </button>

        {data ? (
          data.allSecondaryLevels.edges.length ? (
            <MyTableComp
              columns={columns}
              data={data?.allSecondaryLevels?.edges}
            />
          ) : (
            <ServerError type="notFound" item="Level" />
          )
        ) : (
          <ServerError type="network" item="Level" />
        )}

        {modalOpen && secondaryLevels && (
          <Modal
            setModalOpen={setModalOpen}
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