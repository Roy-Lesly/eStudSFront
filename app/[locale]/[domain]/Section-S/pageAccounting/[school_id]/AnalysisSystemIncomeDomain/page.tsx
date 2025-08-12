import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import { removeEmptyFields } from '@/functions'
import { Metadata } from 'next';
import getApolloClient from '@/utils/graphql/GetAppolloClient';

export const metadata: Metadata = {
  title: "Income-Domain",
  description: "e-conneq School System. Income-Domain Accounting Page",
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
      <List params={p} data={data} dataYears={dataYears} searchParams={sp} />
    </div>
  )
}

export default page


const GET_DATA = gql`
  query GetData(
    $schoolId: Int!,
    $academicYear: String!
  ) {
    transactionTotalsByDomain(
      schoolId: $schoolId, 
      academicYear: $academicYear
    ) {
      balanceIdCharges
      balancePlatformCharges
      balanceRegistration
      balanceTuition
      count
      domainName
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

const GET_DATA_YEAR = gql`
  query GetData {
    allAcademicYears
  }
`;


