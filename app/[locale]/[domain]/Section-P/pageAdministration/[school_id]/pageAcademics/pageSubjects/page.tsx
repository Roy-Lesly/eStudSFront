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

  paginationParams.level = sp?.level
  paginationParams.subjectName = sp?.subjectName
  paginationParams.academicYear = sp?.academicYear

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      schoolId: p.school_id,
    },
  });


  return (
    <div>
      <List
        params={p}
        data={data?.allSubjectsPrim?.edges}
        apiYears={data?.allAcademicYearsPrim}
        apiLevels={data?.getLevelsPrim}
        sp={sp}
      />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Subjects-Management",
  description: "This is Subjects-Management Page",
};




const GET_DATA = gql`
 query GetData(
   $schoolId: Decimal,
   $level: String,
   $academicYear: String,
   $subjectName: String,
  ) {
    allSubjectsPrim(
      last: 100,
      schoolId: $schoolId
      subjectName: $subjectName
      academicYear: $academicYear
      level: $level
    ){
      edges {
        node {
          id
          mainsubjectprim { id subjectName }
          classroomprim { id academicYear level tuition }
        }
      }
    }
    allAcademicYearsPrim
    getLevelsPrim
  }
`;
