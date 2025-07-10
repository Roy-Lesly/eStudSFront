import { Metadata } from 'next';
import React from 'react'
import { decodeUrlID, removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';



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
  const client = getApolloClient(p.domain);
  let dataPreinscription;
  let dataSpecialties;

  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        id: parseInt(decodeUrlID(sp?.id)),
        schoolId: parseInt(p.school_id),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataPreinscription = result.data;
  } catch (error: any) {
    errorLog(error)
    dataPreinscription = null;
  }

  try {
    const result = await client.query<any>({
      query: GET_DATA_SPECIALTIES,
      variables: {
        ...removeEmptyFields(paginationParams),
        schoolId: parseInt(p.school_id),
      },
      fetchPolicy: 'no-cache'
    });
    dataSpecialties = result.data;
  } catch (error: any) {
    errorLog(error)
    dataSpecialties = null;
  }

  return (
    <div>
      <List
        params={p}
        dataPreinscription={dataPreinscription.allPreinscriptions?.edges[0]}
        dataExtra={dataPreinscription}
        searchParams={sp}
        dataSpecialties={dataSpecialties?.allSpecialties?.edges}
      />
    </div>
  )
}

export default EditPage



const GET_DATA_SPECIALTIES = gql`
 query GetData(
   $schoolId: Decimal,
   $domainName: String,
   $academicYear: String,
   $level: Decimal,
  ) {
    allSpecialties(
      last: 100,
      schoolId: $schoolId
      domainName: $domainName
      academicYear: $academicYear
      level: $level
    ){
      edges {
        node {
          id 
          academicYear
          level {
            level
          }
          mainSpecialty {
            id specialtyName
          }
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
  allSchoolInfos(id: $schoolId){
    edges {
      node {
        prefix method
      }
    }
  }
  allPreinscriptions(
      id: $id
    ){
      edges {
        node {
          id registrationNumber firstName lastName fullName dob pob address sex email telephone 
          fatherName motherName fatherTelephone motherTelephone parentAddress session
          level academicYear nationality
          highestCertificate regionOfOrigin yearObtained
          specialtyOne { id specialtyName }
          specialtyTwo { id specialtyName }
          campus { id campus }
          program { id name }
        }
      }
    }
    allMainSpecialties ( last: 100 ) {
      edges {
        node {
          id 
          specialtyName
        }
      }
    }
    allLevels {
      edges {
        node {
          id 
          level
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
    allPrograms {
      edges {
        node {
          id 
          name
        }
      }
    }
    allAcademicYears
  }
`;
