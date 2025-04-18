'use client';

import React, { useState } from 'react'; // Importing icons
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { gql, useMutation } from '@apollo/client';
import { decodeUrlID } from '@/functions';
import { Metadata } from 'next';
import SearchMultiple from '@/section-s/Search/SearchMultiple';
import DataResults from './DataResults';
import DataSubjects from './DataSubjects';
import ButtonUpdate from '@/section-s/Buttons/ButtonUpdate';
import DefaultLayout from '@/DefaultLayout';

export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "This is Main-Subject Page Admin Settings",
};

const ListResults = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [createResultSecondary] = useMutation(CREATE_RESULT);

  const UpdateResultWithSubject = async () => {
    const confirmUpdate = window.confirm(`Are you sure you want to update`);
    if (!confirmUpdate) {
      return;
    }
    try {
      await createResultSecondary({
        variables: {
          subjectId: parseInt(decodeUrlID(searchParams.subject))
        }
      });
      window.location.reload()
    } catch (error) {
      alert(`Error Updating:", ${error}`);
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
              names={['fullName', 'telephone']}
              link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/Users`}
            />
          }
        />
      }
    >
      <Breadcrumb
        department="Results"
        subRoute="List"
        pageName="Results"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/BatchOperations/Results/Performance/`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/BatchOperations/Results/Performance/`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        {searchParams?.type === "subject" ?
          data ?
            data.allSubjects?.edges.length ?
              <DataSubjects data={data?.allSubjects?.edges} params={params} />
              :
              <ServerError type="notFound" item="Subjects" />
            :
            <ServerError type="network" item="Subjects" />
          :
          null
        }


        {searchParams?.type === "result" ?
          data ?
            data.allResultSecondary?.edges.length ?
              <DataResults data={data?.allResultSecondary?.edges} searchParams={searchParams} params={params} />
              :
              <div className='flex flex-col gap-10 items-center justify-center'>
                <button onClick={UpdateResultWithSubject}>Update</button>
                <ButtonUpdate handleUpdate={UpdateResultWithSubject} dataToSubmit={["XXXXX"]} />
                <ServerError type="notFound" item="Results" />
              </div>
            :
            <ServerError type="network" item="Results" />
          :
          null
        }



      </div>
    </DefaultLayout>
  );
};

export default ListResults;


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

const CREATE_RESULT = gql`
  mutation Create(
    $subjectId: ID!
  ) {
    createResultSecondary(
      subjectId: $subjectId, 
      infoField: "{}"
    ) {
      resultSecondary {
        id student { user { fullName}} subject { mainSubject {subjectName}}
      }
    }
  }
`;