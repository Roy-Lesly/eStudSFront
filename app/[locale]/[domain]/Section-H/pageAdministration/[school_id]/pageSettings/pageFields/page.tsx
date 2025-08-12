import { Metadata } from 'next';
import React from 'react'
import { removeEmptyFields } from '@/functions';
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
        params={p}
        data={data}
      />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Field-Settings",
  description: "e-conneq School System. Field-Settings Page",
};




const GET_DATA = gql`
 query GetData(
   $fieldName: String,
   $domainName: String,
  ) {
    allFields(
      last: 100,
      fieldName: $fieldName
      domainName: $domainName
    ){
      edges {
        node {
          id 
          fieldName
          domain {
            id
            domainName
          }
        }
      }
    }
    allDomains(
      last: 100,
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
