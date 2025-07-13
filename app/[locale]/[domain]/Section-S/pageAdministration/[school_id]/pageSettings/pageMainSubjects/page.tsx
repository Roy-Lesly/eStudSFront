import { Metadata } from 'next';
import React from 'react'
import { gql } from '@apollo/client';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
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
  description: "This is Subject-List Page",
};




const GET_DATA = gql`
 query GetData {
    allMainSubjectSec {
      edges {
        node {
          id 
          subjectName
        }
      }
    }
  }
`;
