import { Metadata } from 'next';
import React, { FC } from 'react'
import { removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const EditPage = async ({
  params,
  searchParams,
}: {
    params: any;
    searchParams: any;
}) => {
  const p = await params;
  const sp = await searchParams;

  const paginationParams: Record<string, any> = {};

  paginationParams.fullName = sp?.fullName
  paginationParams.registrationNumber = sp?.registrationNumber
  paginationParams.academicYear = sp?.academicYear


  const dataPending = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA_PREINSCRIPTION,
    variables: {
      ...removeEmptyFields(paginationParams),
      admissionStatus: false,
    },
  });

  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      schoolId: parseInt(p?.school_id),
    },
  });



  return (
    <div>
      <List 
      params={p} 
      dataPending={dataPending?.allPreinscriptionsPrim?.edges}
      dataYears={data?.allAcademicYears} 
      searchParams={sp} 
      />
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
}
`;

const GET_DATA_PREINSCRIPTION = gql`
 query Get(
  $fullName: String
  $registrationNumber: String
  $academicYear: String
  $admissionStatus: Boolean!
) {
  allPreinscriptionsPrim(
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
        fullName sex dob pob address status
        fatherName motherName fatherTelephone motherTelephone parentAddress parentEmail
        academicYear admissionStatus action
        program { id name }
        campus { id schoolName campus }
      }
    }
  }  
}
`;
