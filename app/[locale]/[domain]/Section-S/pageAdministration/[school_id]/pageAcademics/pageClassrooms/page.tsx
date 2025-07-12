import { Metadata } from 'next';
import React from 'react'
import { removeEmptyFields } from '@/functions';
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

  paginationParams.stream = sp?.stream
  paginationParams.level = sp?.level
  // paginationParams.academicYear = sp?.academicYear ? sp?.academicYear : `${new Date().getFullYear()}`

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      schoolId: p.school_id,
    },
  });

  console.log(data);
  console.log(`${new Date().getFullYear()}`);


  return (
    <div>
      <List
        params={p}
        data={data}
        sp={sp}
      />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Classroom-Settings",
  description: "This is Classroom-Settings Page",
};




const GET_DATA = gql`
 query GetData(
   $schoolId: Decimal,
   $stream: String,
   $academicYear: String,
   $level: String,
  ) {
    allClassroomsSec(
      last: 100,
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
  }
`;
