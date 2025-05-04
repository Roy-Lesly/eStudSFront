import { Metadata } from 'next';
import React, { FC } from 'react'
import getApolloClient, { decodeUrlID, getData, removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string, course_id: string, domain: string };
  searchParams?: any
}) => {
 
    const client = getApolloClient(params.domain);
    let data;
    try {
        const result = await client.query<any>({
          query: GET_DATA,
          fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
      console.log(error)
      
      data = null;
    }
  

  return (
    <div>
    <List params={params} data={data} searchParams={searchParams} />
  </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Level-Settings",
  description: "This is Level-Settings Page",
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
