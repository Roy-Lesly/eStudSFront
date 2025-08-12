import React from 'react'
import { gql } from '@apollo/client'
import { removeEmptyFields } from '@/functions'
import { Metadata } from 'next';
import List from './List';
import getApolloClient from '@/utils/graphql/GetAppolloClient';

export const metadata: Metadata = {
  title: "Income-Specialty",
  description: "e-conneq School System. Income-Specialty Accounting Page",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const p = await params;
  const sp = await searchParams;

  const paginationParams: Record<string, any> = {};

  paginationParams.academicYear = sp?.academicYear
  paginationParams.level = parseInt(sp?.level)

  const client = getApolloClient(p.domain);
  let data;
  let dataYears;
  if (paginationParams?.academicYear) {
    try {
      const result = await client.query<any>({
        query: GET_DATA,
        variables: {
          ...removeEmptyFields(paginationParams),
          schoolId: parseInt(p.school_id),
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
        p={p}
        data={data}
        dataYears={dataYears?.allAcademicYears}
        dataLevels={dataYears?.allLevels?.edges}
        sp={sp}
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



