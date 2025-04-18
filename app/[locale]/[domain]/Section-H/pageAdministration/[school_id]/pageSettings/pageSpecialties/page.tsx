import { Metadata } from 'next';
import React from 'react'
import getApolloClient, { removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';


const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string, specialty_id: string, domain: string };
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = { };

  const date =  new Date().getFullYear()
  
  paginationParams.specialtyName = searchParams?.specialtyName
  paginationParams.domainName = searchParams?.domainName
  paginationParams.academicYear = searchParams?.academicYear ? searchParams?.academicYear :`${new Date().getFullYear()}` 
    const client = getApolloClient(params.domain);
    let data;
    try {
        const result = await client.query<any>({
          query: GET_DATA,
          variables: {
            ...removeEmptyFields(paginationParams),
            schoolId: params.school_id,
            timestamp: new Date().getTime()
          },
          fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
      console.log(error)
      if (error.networkError && error.networkError.result) {
        console.error('GraphQL Error Details:', error.networkError.result.errors);
      }
      data = null;
    }

  return (
    <div>
    <List params={params} data={data} searchParams={searchParams} />
  </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Specialty-Settings",
  description: "This is Specialty-Settings Page",
};




const GET_DATA = gql`
 query GetData(
   $schoolId: Decimal,
   $specialtyName: String,
   $domainName: String,
   $academicYear: String,
   $level: Decimal,
  ) {
    allSpecialties(
      last: 100,
      schoolId: $schoolId
      specialtyName: $specialtyName
      domainName: $domainName
      academicYear: $academicYear
      level: $level
    ){
      edges {
        node {
          id 
          academicYear
          resultType
          school { id }
          level {
            id
            level
          }
          mainSpecialty {
            id
            specialtyName
          }
          registration tuition paymentOne paymentTwo paymentThree
          school { campus}
          studentCount
        }
      }
    }
    allMainSpecialties(
      last: 100,
      specialtyName: $specialtyName
    ){
      edges {
        node {
          id 
          specialtyName
          specialtyNameShort
          field { id fieldName }
        }
      }
    }
    allLevels(
      last: 100,
    ){
      edges {
        node {
          id level
        }
      }
    }
    allFields(
      last: 100,
    ){
      edges {
        node {
          id fieldName
        }
      }
    }
    allAcademicYears
  }
`;
