import { Metadata } from 'next';
import React from 'react'
import getApolloClient, { decodeUrlID, removeEmptyFields } from '@/functions';
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

  paginationParams.id = searchParams?.id
  paginationParams.level = searchParams?.level
  paginationParams.academicYear = searchParams?.academicYear
  paginationParams.domainName = searchParams?.domainName
  const client = getApolloClient(params.domain);
  let data;
  let dataSpecialties;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        id: parseInt(decodeUrlID(searchParams?.id)),
        schoolId: parseInt(params.school_id),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error, 35)
    data = null;
  }

  try {
    const result = await client.query<any>({
      query: GET_DATA_SPECIALTIES,
      variables: {
        ...removeEmptyFields(paginationParams),
        schoolId: parseInt(params.school_id),
      },
      fetchPolicy: 'no-cache'
    });
    dataSpecialties = result.data;
  } catch (error: any) {
    console.log(error, 55)
    dataSpecialties = null;
  }

  console.log(data?.allPreinscriptions?.edges[0].node, 55)


  return (
    <div>
      <List params={params} data={data} searchParams={searchParams} dataSpecialties={dataSpecialties} />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Admission",
  description: "This is Admission Page",
};


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
          school { campus}
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
        prefix
      }
    }
  }
  allPreinscriptions(
      id: $id
    ){
      edges {
        node {
          id registrationNumber firstName lastName fullName dob pob address sex email telephone emergencyName emergencyTelephone session
          level campus program specialtyOne specialtyTwo academicYear nationality nationality highestCertificate regionOfOrigin yearObtained
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
