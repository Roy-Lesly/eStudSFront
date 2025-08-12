import { Metadata } from 'next';
import React from 'react'
import { removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
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

  paginationParams.stream = sp?.stream
  paginationParams.level = sp?.level
  // paginationParams.academicYear = sp?.academicYear ? sp?.academicYear : `${new Date().getFullYear()}`

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_CLASSROOM_SEC,
    variables: {
      ...removeEmptyFields(paginationParams),
      schoolId: p.school_id,
    },
  });

  return (
    <div>
      <List
        params={p}
        data={data}
        sp={sp}
        apiLevel={data?.getLevelsSec}
      />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Classroom-Settings",
  description: "e-conneq School System. Classroom-Settings Page",
};




const GET_DATA_CLASSROOM_SEC = gql`
 query GetData(
   $id: ID,
   $schoolId: Decimal,
   $stream: String,
   $academicYear: String,
   $level: String,
  ) {
    allClassroomsSec(
      last: 100,
      id: $id
      schoolId: $schoolId
      stream: $stream
      academicYear: $academicYear
      level: $level
    ){
      edges {
        node {
          id 
          academicYear
          school { id }
          level
          stream
          select
          cycle
          registration tuition paymentOne paymentTwo paymentThree
          school { campus}
          studentCount
        }
      }
    }
    allAcademicYearsSec
    getLevelsSec
  }
`;
