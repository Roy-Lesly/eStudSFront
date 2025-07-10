import React from 'react'
import List from './List'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import getApolloClient from '@/functions';

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
      let dataLogins;

    try {
      const result = await client.query<any>({
        query: GET_DATA_LOGIN,
        variables: {
          // schoolId: parseInt(params.school_id),
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      dataLogins = result.data;
    } catch (error: any) {
      console.log(error, 81)
      dataLogins = null;
    }

  return (
    <List params={p} searchParams={sp} />
  )
}

export default page


export const metadata: Metadata = {
    title: "Management",
    description: "This is Manangement Page Settings",
};


const GET_DATA_LOGIN = gql`
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
