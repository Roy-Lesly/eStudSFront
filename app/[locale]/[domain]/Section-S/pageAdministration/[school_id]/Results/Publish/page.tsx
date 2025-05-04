import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Publish Page",
  description: "This is Publish Page Admin Settings",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = {};

  paginationParams.academmicYear = searchParams?.academmicYear ? searchParams.academmicYear : ""
  paginationParams.level = searchParams?.level ? searchParams.level : ""
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

    
    data = null;
  }

console.log(data, 44)

  return (
    <div>
      <List params={params} data={data} />
    </div>
  )
}

export default page


const GET_DATA = gql`
 query GetAllData(
  $academicYear: String,
  $level: String,
) {
  allPublishSecondary(
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

