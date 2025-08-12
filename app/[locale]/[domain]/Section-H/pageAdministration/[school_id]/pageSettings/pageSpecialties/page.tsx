import { Metadata } from 'next';
import React from 'react'
import { getAcademicYear, removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';
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

  paginationParams.specialtyName = sp?.specialtyName
  paginationParams.domainName = sp?.domainName
  paginationParams.academicYear = sp?.academicYear ? sp?.academicYear : getAcademicYear()

console.log({
      ...removeEmptyFields(paginationParams),
      schoolId: parseInt(p.school_id),
    });

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      schoolId: parseInt(p.school_id),
    },
  });

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
  description: "e-conneq School System. Specialty-Settings Page",
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
          program { id name }
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
    allPrograms(
      last: 100,
    ){
      edges {
        node {
          id name
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
