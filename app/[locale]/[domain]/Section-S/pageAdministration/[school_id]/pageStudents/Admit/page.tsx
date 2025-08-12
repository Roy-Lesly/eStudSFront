import React from 'react'
import Form from './Form'
import { gql } from '@apollo/client'
import { Metadata } from 'next';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

export const metadata: Metadata = {
  title: "Admission Page",
  description: "e-conneq School System. Admission Page Admin Settings",
};

const page = async ({
  params,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  // const sp = await searchParams;

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
    <div>
      <Form params={p} data={data} />
    </div>
  )
}

export default page


const GET_DATA = gql`
 query GetAllData {
  allAcademicYears
  allSchoolInfos(
    last: 100
  ) {
    edges {
      node {
        id campus town
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
    last: 300
  ) {
    edges {
      node {
        id specialtyName
      }
    }
  }
}
`;
