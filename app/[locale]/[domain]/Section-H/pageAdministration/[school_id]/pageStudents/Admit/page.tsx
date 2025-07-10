import React from 'react'
import Form from './Form'
import { gql } from '@apollo/client'
import { Metadata } from 'next';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

export const metadata: Metadata = {
  title: "Admission Page",
  description: "This is Admission Page Admin Settings",
};

const page = async ({
  params,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;

   const data = await queryServerGraphQL({
      domain: p.domain,
      query: GET_DATA,
    });

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
