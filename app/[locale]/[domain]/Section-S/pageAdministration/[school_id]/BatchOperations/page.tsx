import React from 'react'
import { gql } from '@apollo/client'
import getApolloClient, { removeEmptyFields } from '@/functions'
import { Metadata } from 'next';
import List from './List';

export const metadata: Metadata = {
  title: "Batch Operation Page",
  description: "This is Batch Operation Page Admin Settings",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const sParams: Record<string, any> = {};

  sParams.academicYear = searchParams?.academicYear ? searchParams.academicYear : `${new Date().getFullYear()}`;
  sParams.level = searchParams?.level ? searchParams.level : "";
  sParams.stream = searchParams?.stream ? searchParams.stream : "GENERAL";

  const cleanedData = removeEmptyFields(sParams);

  console.log(cleanedData, 30)
  const client = getApolloClient(params.domain);
  let data;
  try {
    if (sParams?.academicYear && sParams?.stream) {
      const result = await client.query<any>({
        query: GET_DATA_CLASSROOM,
        variables: {
          ...cleanedData,
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      data = result.data;
    }
  } catch (error: any) {
    console.log(error, 44)
    if (error.networkError && error.networkError.result) {
      console.error('GraphQL Error Details:', error.networkError.result.errors);
    }
    data = null;
  }
  
  return (
    <div>
      {searchParams.pageType == "results" ? <List pageType={searchParams.pageType} params={params} searchParams={{...sParams, pageType: searchParams.pageType}} data={data?.allClassrooms?.edges} /> : null}
      {searchParams.pageType == "timetable" ? <List pageType={searchParams.pageType} params={params} searchParams={{...sParams, pageType: searchParams.pageType}} data={data?.allClassrooms?.edges} /> : null}
    </div>
  )
}

export default page





const GET_DATA_CLASSROOM = gql`
 query GetAllData(
  $academicYear: String!,
  $stream: String!,
) {
  allClassrooms(
    academicYear: $academicYear
    stream: $stream
    last: 5
  ) {
    edges {
      node {
        id academicYear stream option level { level}
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

