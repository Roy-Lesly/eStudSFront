import { Metadata } from 'next';
import React, { FC } from 'react'
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

  const paginationParams: Record<string, any> = {};


  paginationParams.domainName = sp?.domainName

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
    },
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
    "Domain-Settings",
  description: "e-conneq School System. Domain-Settings Page",
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
