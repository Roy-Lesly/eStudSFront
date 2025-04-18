import React from 'react'
import { gql } from '@apollo/client'
import getApolloClient, { decodeUrlID } from '@/functions'
import { Metadata } from 'next';
import List from './List';

export const metadata: Metadata = {
  title: "Time Table Page",
  description: "This is Time Table Page Admin Settings",
};


const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const client = getApolloClient(params.domain);
  let data;
  if (searchParams.class && searchParams?.type == "subject"){
    try {
      const result = await client.query<any>({
        query: GET_DATA_SUBJECT,
        variables: {
          classroomId: parseInt(decodeUrlID(searchParams?.class)),
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      data = result.data;
    } catch (error: any) {
      console.log(error,32)
      if (error.networkError && error.networkError.result) {
        console.error('GraphQL Error Details:', error.networkError.result.errors);
      }
      data = null;
    }
  }
  if (searchParams.subject && searchParams?.type == "result"){
    try {
      const result = await client.query<any>({
        query: GET_DATA_RESULT,
        variables: {
          subjectId: parseInt(decodeUrlID(searchParams?.subject)),
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      data = result.data;
    } catch (error: any) {
      console.log(error,32)
      if (error.networkError && error.networkError.result) {
        console.error('GraphQL Error Details:', error.networkError.result.errors);
      }
      data = null;
    }
  }
  
  return (
    <div>
      <List params={params} data={data} searchParams={searchParams} />
    </div>
  )
}

export default page


const GET_DATA_SUBJECT = gql`
 query GetAllData(
  $classroomId: Decimal!,
) {
  allSubjects(
    classroomId: $classroomId
  ) {
    edges {
      node {
        id 
        subjectCode
        subjectCoefficient
        subjectType
        mainSubject { subjectName}
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

const GET_DATA_RESULT = gql`
 query GetAllData(
  $subjectId: Decimal!,
) {
  allResultSecondary(
    subjectId: $subjectId
  ) {
    edges {
      node {
        id 
        subject { 
          mainSubject { subjectName}} 
        student { 
          user {fullName matricle}
          classroom { academicYear stream level { level}}
        }
        info
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

