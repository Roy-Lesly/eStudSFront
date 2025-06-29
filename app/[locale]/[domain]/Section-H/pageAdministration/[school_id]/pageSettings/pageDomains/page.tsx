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

  const paginationParams: Record<string, any> = { };

  
  paginationParams.domainName = sp?.domainName
    const client = getApolloClient(p.domain);
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
