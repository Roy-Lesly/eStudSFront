import { Metadata } from 'next';
import React, { FC } from 'react'
import getApolloClient, { decodeUrlID, getData, removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string, course_id: string, domain: string };
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = {};

  paginationParams.fullName = searchParams?.fullName
  paginationParams.registrationNumber = searchParams?.registrationNumber
  paginationParams.academicYear = searchParams?.academicYear

  const client = getApolloClient(params.domain);
  let dataPending;
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA_PENDING,
      variables: {
        ...removeEmptyFields(paginationParams),
        admissionStatus: false,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataPending = result.data;
  } catch (error: any) {
    console.log(error)
    
    dataPending = null;
  }
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        ...removeEmptyFields(paginationParams),
        admissionStatus: true,
        schoolId: parseInt(params.school_id),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error)
    console.error('GraphQL Error Details:', error.networkError.result.errors);
    data = null;
  }

  return (
    <div>
      <List params={params} dataPending={dataPending} data={data} searchParams={searchParams} />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Pre-Inscription",
  description: "Pre-Inscription Page",
};




const GET_DATA = gql`
 query Get(
  $fullName: String
  $registrationNumber: String
  $academicYear: String
  $admissionStatus: Boolean!
  $schoolId: ID!
) {
  allAcademicYears
  allSchoolInfos(
    id: $schoolId
  ) {
    edges {
      node {
        id campus
      }
    }
  }
  allPreinscriptions(
    fullName: $fullName
    registrationNumber: $registrationNumber
    academicYear: $academicYear
    admissionStatus: $admissionStatus
    last: 100
  ){
    edges {
      node {
        id 
        campus registrationNumber firstName lastName
        fullName sex email sex dob pob address telephone status emergencyName emergencyTown
        program level session academicYear
        specialtyTwo campus admissionStatus action 
      }
    }
  }  
}
`;

const GET_DATA_PENDING = gql`
 query Get(
  $fullName: String
  $registrationNumber: String
  $academicYear: String
  $admissionStatus: Boolean!
) {
  allAcademicYears
  allPreinscriptions(
    fullName: $fullName
    registrationNumber: $registrationNumber
    academicYear: $academicYear
    admissionStatus: $admissionStatus
    last: 100
  ){
    edges {
      node {
        id 
        registrationNumber firstName lastName
        fullName sex email sex dob pob address telephone status emergencyName emergencyTown
        program level session academicYear
        specialtyTwo campus admissionStatus action 
      }
    }
  }  
}
`;
