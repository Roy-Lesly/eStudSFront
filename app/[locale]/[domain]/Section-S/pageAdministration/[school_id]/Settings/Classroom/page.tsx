import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Classroom Page",
  description: "This is Classroom Page Admin Settings",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = {};

  paginationParams.level = searchParams?.level ? searchParams.level : ""
  paginationParams.stream = searchParams?.stream ? searchParams.stream : ""
  paginationParams.academicYear = searchParams?.academicYear ? searchParams.academicYear : ""
  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        ...paginationParams,
        schoolId: params.school_id,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error,32)
    
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
  $schoolId: Decimal!,
  $level: String,
  $stream: String,
  $academicYear: String,
) {
  allClassrooms(
    schoolId: $schoolId
    level: $level
    stream: $stream
    academicYear: $academicYear
    last: 100
  ) {
    edges {
      node {
        id academicYear stream option level { level} school {campus}
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
  allSecondaryLevels{
    edges {
      node {
        id level
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

