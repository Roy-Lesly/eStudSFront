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
  searchParams
}: {
    params: any,
  searchParams?: any
}) => {

   const p = await params;
    const sp = await searchParams;

  const client = getApolloClient(p.domain);
  let data;
  let dataYears;

  if (p?.specialty_id) {
    try {
      const result = await client.query<any>({
        query: GET_DATA,
        variables: {
          schoolId: parseInt(p.school_id),
          specialtyId: parseInt(p.specialty_id),
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

  return (
    <div>
      <List 
        params={p} 
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


