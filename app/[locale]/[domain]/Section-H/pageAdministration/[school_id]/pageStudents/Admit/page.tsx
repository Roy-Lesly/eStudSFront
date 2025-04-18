import React from 'react'
import Form from './Form'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admission Page",
  description: "This is Admission Page Admin Settings",
};

const page = async ({
  params,
}: {
  params: any,
  searchParams?: any
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
    <div>
      <Form params={params} data={data} />
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
