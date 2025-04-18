import React from 'react'
import getApolloClient, { getDataNotProtected } from '@/functions';
import { protocol } from '@/config';
import { Metadata } from 'next';
import { GetSchoolIdentificationInter } from '@/Domain/Utils-H/appControl/appInter';
import { GetSchoolIdentificationUrl } from '@/Domain/Utils-H/appControl/appConfig';
import NotificationError from '@/section-h/common/NotificationError';
import { gql } from '@apollo/client';
import PreInsNavBar from '../PreInsNavBar';
import PreForm from './PreForm';

const page = async ({
  params,
  searchParams,
}: {
  params: { locale: string, domain: string, registration_number: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const client = getApolloClient(params.domain);
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
    console.log(error)
    data = null;
  }

  return (
    <>
      {searchParams && <NotificationError errorMessage={searchParams} />}

      <div className="flex flex-col gap-4 h-screen md:p-4 p-2 text-slate-900">

        <div className='flex flex-col gap-2 w-full'>
          <PreForm source='student' params={params} data={data} link='/Check' />
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
        id campus town schoolIdentification { name }
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