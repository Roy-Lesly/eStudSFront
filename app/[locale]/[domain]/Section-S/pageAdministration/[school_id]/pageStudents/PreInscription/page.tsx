import { Metadata } from 'next';
import React, { FC } from 'react'
import { removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

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

  const client = getApolloClient(p.domain);
  let dataPending;
  let dataAdmitted;
  let data;

  try {
    const result = await client.query<any>({
      query: GET_DATA_PREINSCRIPTION,
      variables: {
        ...removeEmptyFields(paginationParams),
        admissionStatus: false,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataPending = result.data;
  } catch (error: any) {
    errorLog(error);
    dataPending = null;
  }

  try {
    const result = await client.query<any>({
      query: GET_DATA_PREINSCRIPTION,
      variables: {
        ...removeEmptyFields(paginationParams),
        admissionStatus: true,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataAdmitted = result.data;
  } catch (error: any) {
    errorLog(error);
    dataAdmitted = null;
  }


  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        ...removeEmptyFields(paginationParams),
        admissionStatus: true,
        schoolId: parseInt(p?.school_id),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error);
    data = null;
  }

  return (
    <div>
      <List 
      params={p} 
      dataPending={dataPending?.allPreinscriptionsSec?.edges}
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
  allPreinscriptionsSec(
    fullName: $fullName
    registrationNumber: $registrationNumber
    academicYear: $academicYear
    admissionStatus: $admissionStatus
    last: 100
  ){
    edges {
      node {
        id registrationNumber
        firstName lastName
        fullName sex sex dob pob address status
        session academicYear
        admissionStatus action 
        fatherTelephone motherTelephone
        campus { id schoolName campus }
      }
    }
  }  
}
`;
