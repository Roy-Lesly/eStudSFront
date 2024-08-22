import { Metadata } from 'next';
import React from 'react'
import { decodeUrlID, removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';



export const metadata: Metadata = {
  title: "Admission Page",
  description: "e-conneq School System. Admission Page Admin Settings",
};


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

  paginationParams.id = sp?.id
  paginationParams.level = sp?.level
  paginationParams.academicYear = sp?.academicYear
  paginationParams.domainName = sp?.domainName

  const dataPreinscription = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      id: parseInt(decodeUrlID(sp?.preId)),
      schoolId: parseInt(p.school_id),
    },
  });

  const dataClassroomsec = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_CLASSROOMS,
    variables: {
      ...removeEmptyFields(paginationParams),
      id: parseInt(decodeUrlID(sp?.classId)),
      schoolId: parseInt(p.school_id),
    },
  });

  return (
    <div>
      <List
        params={p}
        dataPreinscription={dataPreinscription}
        sp={sp}
        dataClassroomsSec={dataClassroomsec?.allClassroomsSec?.edges}
      />
    </div>
  )
}

export default EditPage



const GET_DATA_CLASSROOMS = gql`
 query GetData(
   $schoolId: Decimal,
   $academicYear: String,
  ) {
    allClassroomsSec(
      last: 100,
      schoolId: $schoolId
      academicYear: $academicYear
    ){
      edges {
        node {
          id 
          academicYear
          level
          stream
          select
          school { campus }
        }
      }
    }
  }
`;



const GET_DATA = gql`
 query GetData(
  $id: ID!
  $schoolId: ID!
 ) {
  allSchoolInfos(
    id: $schoolId
  ){
    edges {
      node {
        id schoolName campus
      }
    }
  }
  allPreinscriptionsSec(
      id: $id
    ){
      edges {
        node {
          id registrationNumber firstName lastName fullName dob pob address sex email 
          fatherName motherName fatherTelephone motherTelephone parentAddress session
          level academicYear stream
          program
          seriesOne { id name }
          nationality highestCertificate regionOfOrigin yearObtained
          campus { id campus }
        }
      }
    }
    allDepartments {
      edges {
        node {
          id name
        }
      }
    }
    allSeries {
      edges {
        node {
          id name level
        }
      }
    }
    getProgramsSec
    allAcademicYearsSec
  }
`;
