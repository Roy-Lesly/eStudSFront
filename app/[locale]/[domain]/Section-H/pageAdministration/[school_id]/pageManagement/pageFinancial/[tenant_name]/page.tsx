import React from 'react'
import List from './List'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import getApolloClient from '@/functions';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, tenant_name: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  // const client = getApolloClient(params.domain);
  const client = getApolloClient(`${params.tenant_name}`, true);
  let dataPlatformPaid;
  let dataPlatformPending;
  let dataTransactions;

  try {
    const result = await client.query<any>({
      query: GET_DATA_PLATFORM_PAID,
      variables: {
        // schoolId: (params.school_id),
        specialtyName: searchParams?.specialty,
        fullName: searchParams?.fullName,
        level: searchParams?.level,
        academicYear: searchParams?.academicYear,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataPlatformPaid = result.data;
  } catch (error: any) {
    console.log(error, 81)
    dataPlatformPaid = null;
  }

  try {
    const result = await client.query<any>({
      query: GET_DATA_PLATFORM_PENDING,
      variables: {
        // schoolId: parseInt(params.school_id),
        specialtyName: searchParams?.specialty,
        fullName: searchParams?.fullName,
        level: searchParams?.level,
        academicYear: searchParams?.academicYear,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataPlatformPending = result.data;
  } catch (error: any) {
    console.log(error, 81)
    dataPlatformPending = null;
  }

  try {
    const result = await client.query<any>({
      query: GET_LAST_PLATFORM_TRANSACTIONS,
      variables: {
        // schoolId: parseInt(params.school_id),
        specialtyName: searchParams?.specialty,
        fullName: searchParams?.fullName,
        level: searchParams?.level,
        academicYear: searchParams?.academicYear,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataTransactions = result.data;
  } catch (error: any) {
    console.log(error, 81)
    dataTransactions = null;
  }

  return (
    <List
      params={params}
      dataPlatformPaid={dataPlatformPaid?.allSchoolFees?.edges}
      dataPlatformPending={dataPlatformPending?.allSchoolFees?.edges}
      dataTransactions={dataTransactions?.allTransactions?.edges}
      sp={searchParams}
    />
  )
}

export default page


export const metadata: Metadata = {
  title: "Management",
  description: "This is Manangement Page Settings",
};


const GET_DATA_PLATFORM_PAID = gql`
  query GetAllData  (
    $schoolId: Decimal,
    $specialtyName: String,
    $fullName: String,
    $level: Decimal,
    $academicYear: String
  ) {
    allSchoolFees (
      schoolId: $schoolId,
      specialtyName: $specialtyName,
      fullName: $fullName,
      level: $level,
      academicYear: $academicYear,
      platformPaid: true,
      last: 200
    ) {
      edges {
        node {
          id userprofile { 
            specialty { academicYear level { level} mainSpecialty { specialtyName}} 
            user { fullName sex matricle sex}
          }
        }
      }
    }
  }
`;


const GET_DATA_PLATFORM_PENDING = gql`
  query GetAllData (
    $schoolId: Decimal,
    $specialtyName: String,
    $fullName: String,
    $level: Decimal,
    $academicYear: String
  ) {
    allSchoolFees (
      schoolId: $schoolId,
      specialtyName: $specialtyName,
      fullName: $fullName,
      level: $level,
      academicYear: $academicYear,
      platformPaid: false,
      last: 200
    ) {
      edges {
        node {
          id 
          userprofile { 
            specialty { academicYear level { level} mainSpecialty { specialtyName}} 
            user { fullName sex matricle sex}
          }
        }
      }
    }
  }
`;


const GET_LAST_PLATFORM_TRANSACTIONS = gql`
  query GetAllData (
    $schoolId: Decimal,
    $specialtyName: String,
    $fullName: String,
    $level: Decimal,
    $academicYear: String
  ) {
    allTransactions (
      schoolId: $schoolId,
      specialtyName: $specialtyName,
      fullName: $fullName,
      level: $level,
      academicYear: $academicYear,
      reason: "platform",
      last: 200
    ) {
      edges {
        node {
          id
          createdAt
          schoolfees {
            userprofile { 
              specialty { academicYear level { level} mainSpecialty { specialtyName}} 
              user { fullName sex matricle sex}
            }
          }
        }
      }
    }
  }
`;
