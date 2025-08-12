import React from 'react'
import List from './List'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { decodeUrlID } from '@/functions';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

const page = async ({
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
    const tenantId = Array.isArray(sp?.id) ? sp?.id[0] : sp?.id;

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
    errorLog(error);
    data = null;
  }

  return (
    <List params={p} searchParams={sp} tenant={data?.allTenants?.edges[0]} />
  )
}

export default page


export const metadata: Metadata = {
  title: "Management",
  description: "e-conneq School System. Manangement Page Settings",
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