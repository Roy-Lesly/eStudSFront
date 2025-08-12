import { Metadata } from 'next';
import React, { FC } from 'react'
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
  title:
    "Level-Settings",
  description: "e-conneq School System. Level-Settings Page",
};




const GET_DATA = gql`
 query GetData {
    allLevels {
      edges {
        node {
          id 
          level
        }
      }
    }
  }
`;
