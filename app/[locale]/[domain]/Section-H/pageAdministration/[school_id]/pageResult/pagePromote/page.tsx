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

  const paginationParams: Record<string, any> = { };

  const date =  new Date().getFullYear()
  
  paginationParams.specialtyName = searchParams?.specialtyName
  paginationParams.domainName = searchParams?.domainName
  paginationParams.level = searchParams?.level
  paginationParams.academicYear = searchParams?.academicYear ? searchParams.academicYear : `${new Date().getFullYear() - (new Date().getMonth() + 1 <= 7 ? 2 : 1)}`;
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
      
      data = null;
    }
      console.log(data, 42)

  return (
    <div>
    <List params={params} data={data} searchParams={searchParams} />
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
   $specialtyName: String,
   $domainName: String,
   $academicYear: String,
   $level: Decimal,
  ) {
    allAcademicYears
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
          level {
            level
          }
          mainSpecialty {
            specialtyName
            field { domain { id}}
          }
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
        }
      }
    }
    allDomains(
      last: 100,
    ){
      edges {
        node {
          id 
          domainName
        }
      }
    }
    allLevels(
      last: 100,
    ){
      edges {
        node {
          id 
          level
        }
      }
    }
    allAcademicYears
  }
`;
