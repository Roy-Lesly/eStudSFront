'use client';

import React, { useState } from 'react';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { gql } from '@apollo/client';
import AdmissionForm from './AdmissionForm';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';


const Form = ({ params, searchParams, data }: { params: any; data: any, searchParams: any }) => {
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
            <></>
          }
        />
      }
    >
      <Breadcrumb
        department={`Admission`}
        subRoute="List"
        pageName={`Admission - ${searchParams.role}`}
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Teachers/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Settings/Teachers/`}
      />

      <AdmissionForm data={data} params={params} role={searchParams.role} />



    </DefaultLayout>
  );
};

export default Form;
