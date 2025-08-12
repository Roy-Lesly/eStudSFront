import React from 'react'
import List from './List'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import getApolloClient from '@/utils/graphql/GetAppolloClient';

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(`${p.tenant_name}`, true);
  
  const dataLogins = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
  });

  return (
    <List params={p} dataLogins={dataLogins} />
  )
}

export default page


export const metadata: Metadata = {
  title: "Management",
  description: "e-conneq School System. Manangement Page Settings",
};


const GET_DATA = gql`
 query GetAllData {
  allLoginGenerals {
    edges {
      node {
         id date countHour totalLogins
      }
    }
  }
  allLoginUsers {
    edges {
      node {
        user { id fullName}
        countHour totalLogins
        loginGeneral { id date countHour totalLogins}
      }
    }
  }
}
`;
