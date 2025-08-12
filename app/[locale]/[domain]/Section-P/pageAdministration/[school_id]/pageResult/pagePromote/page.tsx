import { Metadata } from 'next';
import React, { FC } from 'react'
import { removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any
}) => {

  const p = await params;
  const sp = await searchParams;

  const paginationParams: Record<string, any> = {};

  const date = new Date().getFullYear()

  paginationParams.specialtyName = sp?.specialtyName
  paginationParams.domainName = sp?.domainName
  paginationParams.level = sp?.level
  paginationParams.academicYear = sp?.academicYear ? sp.academicYear : `${new Date().getFullYear() - (new Date().getMonth() + 1 <= 7 ? 2 : 1)}`;

  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      schoolId: p.school_id,
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
    "Promotion",
  description: "e-conneq School System. Promotion Page",
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
