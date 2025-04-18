import React from 'react'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
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

  const client = getApolloClient(params.domain);
  let data;
  let dataYears;
  if (params?.specialty_id) {
    try {
      const result = await client.query<any>({
        query: GET_DATA,
        variables: {
          schoolId: parseInt(params.school_id),
          specialtyId: parseInt(params.specialty_id),
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
  console.log(data, 64)
  console.log(params, 66)

  return (
    <div>
      <List 
        params={params} 
        data={data?.transactionTotalsByStudent} 
      />
    </div>
  )
}

export default page


const GET_DATA = gql`
  query GetData(
    $schoolId: Int!,
    $specialtyId: Int!
  ) {
    transactionTotalsByStudent(
      schoolId: $schoolId, 
      specialtyId: $specialtyId
    ) {
      fullName
      specialtyName
      academicYear
      level
      paid
      balance
      registration
      tuition
      scholarship
    }
  }
`;


