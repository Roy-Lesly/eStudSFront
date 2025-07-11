import { Metadata } from 'next';
import React from 'react'
import { decodeUrlID } from '@/functions';
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
    <List params={p} data={data} searchParams={sp} />
  </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title: "Program-Settings",
  description: "This is Program-Settings Page",
};




const GET_DATA = gql`
 query GetData {
    allPrograms {
      edges {
        node {
          id 
          name
          description
        }
      }
    }
  }
`;
