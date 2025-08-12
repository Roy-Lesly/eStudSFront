import { Metadata } from 'next';
import React, { FC } from 'react'
import { decodeUrlID, removeEmptyFields } from '@/functions';
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

  paginationParams.specialtyName = sp?.spec
  paginationParams.academicYear = sp?.nextYear
  paginationParams.domainId = parseInt(decodeUrlID(sp?.dom))
  paginationParams.level = sp?.next

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      schoolId: p.school_id,
      specialtyId: parseInt(decodeUrlID(p.specialty_id)),
      specialtyId2: parseInt(decodeUrlID(p.specialty_id)),
    },
  });

  const dataNextSpec = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      schoolId: p.school_id,
    },
  });

  return (
    <div>
      <List params={p} data={data} dataNextSpec={dataNextSpec} searchParams={sp} />
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
          customuser {
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
          infoData
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
          customuser {
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
          infoData
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