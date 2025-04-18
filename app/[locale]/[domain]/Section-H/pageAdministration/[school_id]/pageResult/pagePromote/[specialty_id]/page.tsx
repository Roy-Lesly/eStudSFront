import { Metadata } from 'next';
import React, { FC } from 'react'
import getApolloClient, { decodeUrlID, getData, removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string, course_id: string, domain: string, specialty_id: string };
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = { };
  
  paginationParams.specialtyName = searchParams?.spec
  paginationParams.academicYear = searchParams?.nextYear
  paginationParams.domainId = parseInt(decodeUrlID(searchParams?.dom))
  paginationParams.level = searchParams?.next
    const client = getApolloClient(params.domain);
    let data;
    let dataNextSpec;
    try {
        const result = await client.query<any>({
          query: GET_DATA,
          variables: {
            schoolId: params.school_id,
            specialtyId: parseInt(decodeUrlID( params.specialty_id)),
            specialtyId2: parseInt(decodeUrlID( params.specialty_id)),
            timestamp: new Date().getTime()
          },
          fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
      if (error.networkError && error.networkError.result) {
        console.error('GraphQL Error Details:', error.networkError.result.errors);
      }
      data = null;
    }
    try {
        const result = await client.query<any>({
          query: GET_DATA_NEXT,
          variables: {
            ...removeEmptyFields(paginationParams),
            schoolId: params.school_id,
            timestamp: new Date().getTime()
          },
          fetchPolicy: 'no-cache'
        });
        dataNextSpec = result.data;
    } catch (error: any) {
      console.error('GraphQL Error Details:', error);
      dataNextSpec = null;
    }

      
  return (
    <div>
    <List params={params} data={data} dataNextSpec={dataNextSpec} searchParams={searchParams} />
  </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Promotion",
  description: "This is Promotion Page",
};




const GET_DATA = gql`
 query GetData(
   $schoolId: Decimal,
   $specialtyId: Decimal,
   $specialtyId2: ID,
  ) {
    allUserProfiles(
      last: 100,
      schoolId: $schoolId
      specialtyId: $specialtyId
    ){
      edges {
        node {
          id
          program { id}
          session
          user {
            id fullName
          }
          specialty {
            id
            academicYear
            level {
              level
            }
            mainSpecialty {
              specialtyName
            }
          }
          info
        }
      }
    }
    allSpecialties(
      last: 5,
      schoolId: $schoolId
      id: $specialtyId2
    ){
      edges {
        node {
          id
          academicYear
          level {
            level
          }
          mainSpecialty {
            specialtyName
          }
        }
      }
    }
  }
`;

const GET_DATA_NEXT = gql`
 query GetData(
   $schoolId: Decimal!,
   $specialtyName: String!,
   $domainId: Decimal!,
   $level: Decimal!,
   $academicYear: String!,
  ) {
    allUserProfiles(
      last: 100,
      schoolId: $schoolId
      specialtyName: $specialtyName
      level: $level
    ){
      edges {
        node {
          id
          user {
            fullName
          }
          specialty {
            id
            academicYear
            level {
              level
            }
            mainSpecialty {
              specialtyName
            }
          }
          info
        }
      }
    }
    allSpecialties(
      last: 100,
      schoolId: $schoolId
      domainId: $domainId
      level: $level
      academicYear: $academicYear
    ){
      edges {
        node {
          id
          academicYear
          level {
            level
          }
          mainSpecialty {
            specialtyName
          }
        }
      }
    }
  }
`;