'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/DefaultLayout';
import ServerError from '@/ServerError';
import PreFormSecondary from '@/app/[locale]/[domain]/pre-inscription/New/SectionSecondary/PreFormSecondary';


const Form = ({ params, data }: { params: any; data: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      domain={params.domain}
      searchComponent={
        <></>
      }
      sidebar={
        <Sidebar
          params={params}
          menuGroups={GetMenuAdministration()}
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
        department="Pre-Registration"
        subRoute="List"
        pageName="Pre-Registration"
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/`}
        subLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/`}
      />

      {data ?
        <PreFormSecondary
          source='admin' params={params} data={data}
        />
        :
        <ServerError type="notFound" item="School Info" />

      }

    </DefaultLayout>
  );
};

export default Form;

