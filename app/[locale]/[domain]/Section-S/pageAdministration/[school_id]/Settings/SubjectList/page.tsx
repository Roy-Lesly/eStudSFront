import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "This is Main-Subject Page Admin Settings",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = {};

  paginationParams.subjectName = searchParams?.subjectName ? searchParams.subjectName : ""
  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        ...paginationParams,
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
      <List params={params} data={data} />
    </div>
  )
}

export default page


const GET_DATA = gql`
 query GetAllData(
  $subjectName: String,
) {
  allMainSubjects(
  subjectName: $subjectName
  last: 100
  ) {
    edges {
      node {
        id subjectName
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
}
`;

