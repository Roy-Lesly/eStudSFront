import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient, { removeEmptyFields } from '@/functions'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Counts",
  description: "This is Counts Accounting Page",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = {};

  paginationParams.academicYear = searchParams?.academicYear

  const client = getApolloClient(params.domain);
  let data;
  let dataYears;
  if (paginationParams?.academicYear) {
    try {
      const result = await client.query<any>({
        query: GET_DATA,
        variables: {
          ...removeEmptyFields(paginationParams),
          schoolId: parseInt(params.school_id),
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      data = result.data;
    } catch (error: any) {
      console.error('Error:', error);
      if (error.networkError) {
        console.error('Network Error:', error.networkError);
      }
      if (error.graphQLErrors) {
        console.error('GraphQL Errors:', error.graphQLErrors);
      }
      data = null;
    }
  }
  try {
    const result = await client.query<any>({
      query: GET_DATA_YEAR,
      variables: {
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataYears = result.data;
  } catch (error: any) {
    dataYears = null;
  }

  return (
    <div>
      <List params={params} data={data} dataYears={dataYears} searchParams={searchParams} />
    </div>
  )
}

export default page


const GET_DATA = gql`
  query GetData(
    $schoolId: Int!,
    $academicYear: String!
  ) {
    totalCountsByAcademicYearAndSchool(
      schoolId: $schoolId, 
      academicYear: $academicYear
    ) {
      domains {
        domainName
        specialties
        courses
        userProfiles
      }
      specialties {
        specialtyName
        level
        courses
        userProfiles
      }
    }
  }
`;

const GET_DATA_YEAR = gql`
  query GetData {
    allAcademicYears
  }
`;


