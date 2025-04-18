'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa'; // Importing icons
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { gql, useMutation } from '@apollo/client';
import Modal from './Modal';
import { decodeUrlID } from '@/functions';
import SearchMultiple from '@/section-s/Search/SearchMultiple';
import ButtonAction from '@/section-s/Buttons/ButtonAction';
import { EdgeCustomUser, NodeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/DefaultLayout';



const List = ({ params, data }: { params: any; data: any }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [secondaryLevels, setSecondaryLevels] = useState<{ id: number, name: string }[]>();
  const [page, setPage] = useState<number>(1); // State to track the active page

  const openModal = () => {
    setModalOpen(true);
  };

  // useEffect(() => {
  //   if (data && data.allUserprofileSec?.edges){
  //     const f = data.allUserprofileSec.edges.map((item: EdgeUserprofileSec) => {
  //       return {"id": decodeUrlID(item.node.id), "name": item.node.user.fullName}
  //     })
  //     if (f){ setSecondaryLevels(f)}
  //   }
  // }, [ data ])

  console.log(data, 39)

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
              names={['fulName', 'telephone']}
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Teachers`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Teachers"
        subRoute="List"
        pageName="Teachers"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Teachers/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Teachers/`}
      />

      <div className="flex mb-4 w-full">
        <div
          className={`w-1/2 px-4 py-2 rounded gap-4 items-center flex justify-center flex-row text-center text-lg font-semibold transition-colors ${page === 1 ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-slate-100'}`}
          onClick={() => setPage(1)}
        >
          <span>Admins Tab</span>
          <span
            onClick={() => router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Teachers/Admit/?role=${page === 1 ? "admin" : "teacher"}`)}
            className={`${page === 2 ? "hidden" : ""} bg-blue-600 cursor-pointer flex focus:outline-none gap-2 hover:bg-blue-700 items-center px-4 py-2 rounded-full text-white`}
          >
            <FaPlus />
          </span>
        </div>

        <div
          className={`w-1/2 px-4 py-2 rounded gap-4 items-center flex justify-center flex-row text-center text-lg font-semibold transition-colors ${page === 2 ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-slate-100'}`}
          onClick={() => setPage(2)}
        >
          <span>Lecturer Tab</span>
          <span
            onClick={() => router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Teachers/Admit/?role=${page === 1 ? "admin" : "teacher"}`)}
            className={`${page === 1 ? "hidden" : ""} bg-blue-600 cursor-pointer flex focus:outline-none gap-2 hover:bg-blue-700 items-center px-4 py-2 rounded-full text-white`}
          >
            <FaPlus />
          </span>
        </div>
      </div>

      <div className="bg-gray-50 flex flex-col items-center justify-center space-y-2">




        {data ? (
          data.allCustomUsers.edges.length ?
            page === 1 ? (
              <DataTable data={data?.allCustomUsers?.edges.filter((item: EdgeCustomUser) => item.node.role == "ADMIN")} />
            ) : (
              <DataTable data={data?.allCustomUsers?.edges.filter((item: EdgeCustomUser) => item.node.role == "TEACHER")} />
            ) : (
              <ServerError type="notFound" item="Teachers" />
            )
        ) : (
          <ServerError type="network" item="Teachers" />
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

const DataTable = ({ data }: { data: EdgeCustomUser[] }) => {

  const [updateSubject] = useMutation(UPDATE_DATA);
  const [deleteSubject] = useMutation(DELETE_DATA);
  const handleDelete = async (item: NodeCustomUser) => {
    try {
      await deleteSubject({ variables: { id: parseInt(decodeUrlID(item.id)) } });
      // alert(`${item.mainSubject.subjectName} - Successfully Deleted`)
      window.location.reload()
    } catch (error) {
      // alert(`Error deleting:", ${item.mainSubject.subjectName}`);
    }
  };

  const handleEdit = async (item: NodeCustomUser) => {
    const newSubjectName = window.prompt(
      // `Update Subject Name (current: ${item.mainSubject.subjectName}):`,
      // item.mainSubject.subjectName 
    );
    // if (!newSubjectName || newSubjectName.trim() === item.mainSubject.subjectName.trim()) {
    //   alert("No changes were made.");
    //   return;
    // }
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
        }
      });
      // alert(`${item.mainSubject.subjectName} - Successfully Updated`)
      window.location.reload()
    } catch (error) {
      // alert(`Error Updating:", ${item.mainSubject.subjectName}`);
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
            <th className="hidden italic md:tale-cell px-1 py-2 text-left text-lg tracking-wide">#</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide w-1/3">Full Name</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Address</th>
            <th className="italic px-1 py-2 text-left text-lg tracking-wide">Sex</th>
            <th className="hidden italic md:table-cell px-1 py-2 text-left text-lg tracking-wide">Telephone</th>
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
              <td className="hidden md:tale-cell px-1 py-2 text-left">{index + 1}</td>
              <td className="px-1 py-2 text-left w-1/3">{item.node.fullName}</td>
              <td className="px-1 py-2 text-left w-1/3">{item.node.address}</td>
              <td className="px-1 py-2 text-left w-1/3">{item.node.sex}</td>
              <td className="hidden md:table-cell px-1 py-2 text-left">{item.node.telephone}</td>
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