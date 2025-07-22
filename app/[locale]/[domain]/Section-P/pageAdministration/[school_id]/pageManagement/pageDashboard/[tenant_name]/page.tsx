import React from 'react'
import List from './List'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { decodeUrlID } from '@/functions';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const tenantId = Array.isArray(sp?.id) ? sp?.id[0] : sp?.id;

  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      tenant_id: parseInt(decodeUrlID(tenantId || "")),

    },
  });

  return (
    <List params={p} searchParams={sp} tenant={data?.allTenants?.edges[0]} />
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