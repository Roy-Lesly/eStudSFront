import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Portal Page",
  description: "This is Portal Page Admin Settings",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = {};

  paginationParams.academicYear = searchParams?.academicYear ? searchParams.academicYear : ""
  paginationParams.level = searchParams?.level ? searchParams.level : ""
  paginationParams.stream = searchParams?.stream ? searchParams.stream : ""
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
    console.log(error, 38)
    
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
  $stream: String,
  $academicYear: String,
  $level: String,
) {
  allPublishSecondary(
  stream: $stream
  academicYear: $academicYear
  level: $level
  last: 100
  ) {
    edges {
      node {
        id
        portalSeq
        publishSeq
        publishTerm
        classroom {
          academicYear
          stream
          level {
            level
          }
        }
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

