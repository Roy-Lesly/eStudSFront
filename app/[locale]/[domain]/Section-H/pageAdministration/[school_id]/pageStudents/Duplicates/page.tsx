import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions';
import List from './List';


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
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    if (error.networkError && error.networkError.result) {
      console.error('GraphQL Error Details:', error.networkError.result.errors);
    }
    data = null;
  }

  return (
    <div>
      <List params={params} data={data?.allCustomUserDuplicates?.edges} searchParams={searchParams} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Users",
  description: "This is Users Page",
};


const GET_DATA = gql`
 query GetAllData {
  allCustomUserDuplicates {
    edges {
      node {
        id fullName matricle sex dob pob address telephone createdAt
      }
    }
  }
}
`;
