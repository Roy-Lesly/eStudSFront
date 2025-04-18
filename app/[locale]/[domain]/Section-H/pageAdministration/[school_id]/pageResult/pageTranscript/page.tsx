import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import { AllUserProfilesResponse } from '@/Domain/schemas/interfaceGraphql'
import List from './List'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const paginationParams: Record<string, any> = { };

  const date =  new Date().getFullYear()
  
  paginationParams.fullName = searchParams?.fullName
  paginationParams.academicYear = searchParams?.academicYear
  paginationParams.schoolId = parseInt(params.school_id)

  const client = getApolloClient(params.domain);
  let dataPending;
  let dataApproved;
  let dataPrinted;
  try {
    const result = await client.query<any>({
      query: GET_DATA_PENDING,
      variables: {
        ...removeEmptyFields(paginationParams),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataPending = result.data;
  } catch (error: any) {
    dataPending = null;
  }
  try {
    const result = await client.query<any>({
      query: GET_DATA_APPROVED,
      variables: {
        ...removeEmptyFields(paginationParams),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataApproved = result.data;
  } catch (error: any) {
    dataApproved = null;
  }
  try {
    const result = await client.query<any>({
      query: GET_DATA_PRINTED,
      variables: {
        ...removeEmptyFields(paginationParams),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataPrinted = result.data;
  } catch (error: any) {
    dataPrinted = null;
  }

  console.log(dataPending, 70)
  console.log(dataApproved, 71)
  console.log(dataPrinted, 72)

  return (
    <div>
      <List params={params} dataPending={dataPending} dataApproved={dataApproved} dataPrinted={dataPrinted} searchParams={searchParams} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Transcript",
  description: "This is Transcript Page",
};




const GET_DATA_PENDING = gql`
 query GetData(
  $fullName: String,
  $schoolId: Decimal!
) {
  allAcademicYears
  allLevels {
    edges {
      node {
        id level
      }
    }
  }
  allTranscriptApplications(
    status: "PENDING"
    schoolId: $schoolId
    fullName: $fullName
    active: true
  ) {
    edges {
      node {
        id 
        status userprofile { id specialty { academicYear level { level} mainSpecialty { specialtyName}} user { fullName matricle sex telephone}}
        createdAt
        createdBy { fullName}  
      }
    }
  }
}
`;

const GET_DATA_APPROVED = gql`
 query GetData(
  $fullName: String,
  $schoolId: Decimal!
) {
  allTranscriptApplications(
    status: "APPROVED"
    schoolId: $schoolId
    fullName: $fullName
    active: true
  ) {
    edges {
      node {
        id 
        status userprofile { specialty { academicYear level { level} mainSpecialty { specialtyName}} user { fullName matricle sex telephone}}
        approvedAt
        approvedBy { fullName}
      }
    }
  }
}
`;

const GET_DATA_PRINTED = gql`
 query GetData(
  $fullName: String,
  $schoolId: Decimal!
) {
  allTranscriptApplications(
    status: "PRINTED"
    schoolId: $schoolId
    fullName: $fullName
    active: true
  ) {
    edges {
      node {
        id 
        status userprofile { specialty { academicYear level { level} mainSpecialty { specialtyName}} user { fullName matricle sex telephone}} printedAt
        printedAt
        printedBy { fullName}
      }
    }
  }
}
`;

