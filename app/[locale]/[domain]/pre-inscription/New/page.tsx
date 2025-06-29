import React from 'react'
import getApolloClient, { errorLog } from '@/functions';
import { Metadata } from 'next';
import NotificationError from '@/section-h/common/NotificationError';
import { gql } from '@apollo/client';
import PreForm from './PreForm';

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(p.domain);
  let data;

  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error);
    data = null;
  }

  return (
    <>
      {sp && <NotificationError errorMessage={sp} />}

      <div className="flex flex-col gap-4 h-screen md:p-4 p-2 text-slate-900">

        <div className='flex flex-col gap-2 w-full'>
          <PreForm source='student' params={p} data={data} link='/Check' />
        </div>
      </div>

    </>
  )
}

export default page


export const metadata: Metadata = {
  title: "New Pre-Inscription Page",
  description: "New Pre-Inscription Page",
};


const GET_DATA = gql`
 query GetAllData {
  allAcademicYears
  allSchoolInfos  {
    edges {
      node {
        id campus town address schoolIdentification { name }
      }
    }
  }
  allPrograms(
    last: 50
  ) {
    edges {
      node {
        id name
      }
    }
  }
  allLevels(
    last: 10
  ) {
    edges {
      node {
        id level
      }
    }
  }
  allMainSpecialties(
    last: 100
  ) {
    edges {
      node {
        id specialtyName
      }
    }
  }
}
`;