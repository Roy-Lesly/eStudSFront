import { Metadata } from 'next';
import React, { FC } from 'react'
import { gql } from '@apollo/client';
import List from './List';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(p.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error);

    data = null;
  }


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
