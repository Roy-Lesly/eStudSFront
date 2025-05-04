import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Subject-Assigned Page",
  description: "This is Subject-Assigned Page Admin Settings",
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
  $subjectName: String,
  $schoolId: Decimal!,
) {
  allSubjects(
    subjectName: $subjectName
    first: 100
  ) {
    edges {
      node {
        id subjectCode subjectCoefficient subjectType compulsory assigned assignedTo { fullName } mainSubject { subjectName }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
  allClassrooms(
    schoolId: $schoolId
  ) {
    edges {
      node {
        id academicYear stream level { level }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
  allMainSubjects(
    subjectName: $subjectName
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

