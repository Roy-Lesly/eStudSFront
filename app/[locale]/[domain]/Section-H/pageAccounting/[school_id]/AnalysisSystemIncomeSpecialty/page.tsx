import React from 'react'
import { gql } from '@apollo/client'
import getApolloClient, { removeEmptyFields } from '@/functions'
import { Metadata } from 'next';
import List from './List';

export const metadata: Metadata = {
  title: "Income-Specialty",
  description: "This is Income-Specialty Accounting Page",
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
  paginationParams.level = parseInt(searchParams?.level)

  const client = getApolloClient(params.domain);
  let data;
  let dataYears;
  if (paginationParams?.academicYear) {
    console.log(29, removeEmptyFields(paginationParams))
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
      // console.error('Error:', error);
      console.error('Error:', error?.message)
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
      query: GET_DATA_YEAR_LEVEL,
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
      <List 
        params={params} 
        data={data} 
        dataYears={dataYears?.allAcademicYears} 
        dataLevels={dataYears?.allLevels?.edges} 
        searchParams={searchParams} 
      />
    </div>
  )
}

export default page


const GET_DATA = gql`
  query GetData(
    $schoolId: Int!,
    $academicYear: String!,
    $level: Int
  ) {
    transactionTotalsBySpecialty(
      schoolId: $schoolId, 
      academicYear: $academicYear,
      level: $level
    ) {
      balanceIdCharges
      balancePlatformCharges
      balanceRegistration
      balanceTuition
      count
      specialtyName
      specialtyId
      level
      expectedIdCharges
      expectedPlatformCharges
      expectedRegistration
      expectedTuition
      idCharges
      platformCharges
      registration
      scholarship
      tuition
    }
  }
`;

const GET_DATA_YEAR_LEVEL = gql`
  query GetData {
    allAcademicYears
    allLevels {
      edges {
        node {
          id level
        }
      }
    }
  }
`;



