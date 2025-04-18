'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import AdmissionForm from './AdmissionForm';
import DefaultLayout from '@/DefaultLayout';


const Form = ({ params, data }: { params: any; data: any }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<any>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setActionType('add');
    setModalOpen(true);
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
          <></>
          }
        />
      }
    >
      <Breadcrumb
        department="Admission"
        subRoute="List"
        pageName="Admission"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Students/`}
      />

      <AdmissionForm data={data} params={params} />

    </DefaultLayout>
  );
};

export default Form;



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