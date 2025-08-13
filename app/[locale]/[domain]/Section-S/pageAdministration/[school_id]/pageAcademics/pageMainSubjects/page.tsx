import { Metadata } from 'next';
import React from 'react'
import { gql } from '@apollo/client';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import { removeEmptyFields } from '@/utils/functions';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;
    const paginationParams: Record<string, any> = {};

  paginationParams.subjectName = sp?.subjectName
  paginationParams.subjectCode = sp?.subjectCode
  

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
      variables: {
        ...removeEmptyFields(paginationParams),
      },
  });


  return (
    <div>
      <List
        p={p}
        data={data?.allMainSubjectSec?.edges}
        sp={sp}
      />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Subject-List",
  description: "e-conneq School System. Subject-List Page",
};




const GET_DATA = gql`
 query GetData (
  $subjectName: String
 ) {
    allMainSubjectSec (
      subjectName: $subjectName
      subjectCode: $subjectCode
    ) {
      edges {
        node {
          id 
          subjectName
          subjectCode
        }
      }
    }
  }
`;
