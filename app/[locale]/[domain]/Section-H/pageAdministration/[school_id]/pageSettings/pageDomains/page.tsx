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

  const paginationParams: Record<string, any> = { };

  const date =  new Date().getFullYear()
  
  paginationParams.domainName = searchParams?.domainName
    const client = getApolloClient(params.domain);
    let data;
    try {
        const result = await client.query<any>({
          query: GET_DATA,
          variables: {
            ...removeEmptyFields(paginationParams),
            timestamp: new Date().getTime()
          },
          fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
      console.log(error)
      
      data = null;
    }
  
    console.log(data, 42)


  return (
    <div>
    <List params={params} data={data} searchParams={searchParams} />
  </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Domain-Settings",
  description: "This is Domain-Settings Page",
};




const GET_DATA = gql`
 query GetData(
   $domainName: String,
  ) {
    allDomains(
      last: 100,
      domainName: $domainName
    ){
      edges {
        node {
          id 
          domainName
        }
      }
    }
  }
`;
