import { Metadata } from 'next';
import React from 'react'
import { decodeUrlID, removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const ClassManagementPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const paginationParams: Record<string, any> = {};

  paginationParams.month =
    sp?.month && sp?.year
      ? `${sp.year}_${String(sp.month).padStart(2, "0")}`
      : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      classroomprimId: parseInt(decodeUrlID(p.classroomprim_id)),
      id: parseInt(decodeUrlID(p.classroomprim_id)),
      ...removeEmptyFields(paginationParams),
    },
  });

  return (
    <div>
      <List
        p={p}
        data={data?.allUserprofilesPrim?.edges}
        classroom={data?.allClassroomsPrim?.edges[0]}
        attendance={data?.allAttendanceGeneralPrimary?.edges[0]}
        sp={sp} />
    </div>
  )
}

export default ClassManagementPage



export const metadata: Metadata = {
  title:
    "Class-Management",
  description: "e-conneq School System. Class-Management Page",
};



const GET_DATA = gql`
 query GetData(
   $id: ID!,
   $classroomprimId: Decimal!,
   $month: String,
  ) {
    allUserprofilesPrim(
      classroomprimId: $classroomprimId
    ){
      edges {
        node {
          id
          customuser { id fullName matricle sex }
          classroomprim {
            academicYear
            level
          }
        }
      }
    }
    allClassroomsPrim(
      id: $id
    ){
      edges {
        node {
          id academicYear level cycle
        }
      }
    }
    allAttendanceGeneralPrimary(
      classroomId: $classroomprimId
      month: $month
    ){
      edges {
        node {
          id
          infoData
          classroom { id level }
          statistics 
          updatedAt
          updatedBy { fullName }
        }
      }
    }
  }
   
`;
