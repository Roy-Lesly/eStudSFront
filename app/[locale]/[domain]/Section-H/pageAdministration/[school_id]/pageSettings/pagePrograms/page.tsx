import { Metadata } from 'next';
import React, { FC } from 'react'
import getApolloClient, { decodeUrlID, errorLog, getData, removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';

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
