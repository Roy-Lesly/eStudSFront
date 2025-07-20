import { Metadata } from 'next';
import React from 'react'
import { decodeUrlID } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';



export const metadata: Metadata = {
  title: "Admission Page",
  description: "This is Admission Page Admin Settings",
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
    domain: p?.domain,
    query: GET_DATA_PREINSCRIPTION,
    variables: {
      id: parseInt(decodeUrlID(sp?.id)),
      schoolId: parseInt(p.school_id),
    },
  });


  const dataExtra = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      schoolId: parseInt(p.school_id),
      schoolId2: parseInt(p.school_id),
    },
  });

  return (
    <div>
      <List
        params={p}
        dataPreinscription={dataPreinscription}
        searchParams={sp}
        dataExtra={dataExtra}
      />
    </div>
  )
}

export default EditPage



const GET_DATA = gql`
 query GetData(
   $schoolId: ID!,
   $schoolId2: Decimal!,
   $academicYear: String,
   $level: String,
  ) {
    getProgramsPrim
    allAcademicYearsPrim
    allSchoolInfos(
      id: $schoolId
    ){
      edges {
        node {
          prefix method
        }
      }
    }
    allClassroomsPrim(
      last: 100,
      schoolId: $schoolId2
      academicYear: $academicYear
      level: $level
    ){
      edges {
        node {
          id 
          academicYear
          level
          school { campus }
        }
      }
    }
  }
`;



const GET_DATA_PREINSCRIPTION = gql`
 query GetData(
  $id: ID!
 ) {
  allPreinscriptionsPrim(
      id: $id
    ){
      edges {
        node {
          id 
          registrationNumber firstName lastName
          fullName sex dob pob address status
          fatherName motherName fatherTelephone motherTelephone parentAddress parentEmail
          academicYear admissionStatus action
          program
          level
          campus { id schoolName campus }
        }
      }
    }
    allDepartments {
      edges {
        node {
          id 
          name
        }
      }
    }
  }
`;
