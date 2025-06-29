import { Metadata } from 'next';
import React from 'react'
import getApolloClient, { errorLog, removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';


const EditPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const paginationParams: Record<string, any> = { };
  
  paginationParams.specialtyName = sp?.specialtyName
  paginationParams.domainName = sp?.domainName
  paginationParams.academicYear = sp?.academicYear ? sp?.academicYear :`${new Date().getFullYear()}` 
    const client = getApolloClient(p.domain);
    let data;
    try {
        const result = await client.query<any>({
          query: GET_DATA,
          variables: {
            ...removeEmptyFields(paginationParams),
            schoolId: p.school_id,
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
    <List params={p} data={data} searchParams={sp} />
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
