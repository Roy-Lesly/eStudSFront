import React from 'react'
import List from './List'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import getApolloClient, { decodeUrlID } from '@/functions';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const client = getApolloClient(params.domain);
  let data;
  try {
    const tenantId = Array.isArray(searchParams?.id) ? searchParams?.id[0] : searchParams?.id;

    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        tenant_id: parseInt(decodeUrlID(tenantId || "")),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error)
    data = null;
  }

  return (
    <List params={params} searchParams={searchParams} tenant={data?.allTenants?.edges[0]} />
  )
}

export default page


export const metadata: Metadata = {
  title: "Management",
  description: "This is Manangement Page Settings",
};


const GET_DATA = gql`
    query GetLoginData(
        $tenant_id: ID
    ) {
    allTenants(
        id: $tenant_id
    ) {
        edges {
            node {
                id 
                user { matricle} 
                schemaName 
                schoolName 
                schoolType 
                isActive 
                description
                domains { 
                    edges {
                        node { domain }
                    }
                }
            }
        }
    }
  }
`;