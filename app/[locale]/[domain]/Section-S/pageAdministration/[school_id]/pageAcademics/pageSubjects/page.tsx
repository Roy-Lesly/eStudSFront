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
  paginationParams.hasSubSubjects = sp?.hasSubSubjects ? sp?.hasSubSubjects === "Yes" ? true : false : null

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
        p={p}
        data={data?.allSubjectsSec?.edges}
        apiYears={data?.allAcademicYearsSec}
        apiLevels={data?.getLevelsSec}
        apiSeries={data?.allSeries?.edges}
        sp={sp}
      />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Subjects-Management",
  description: "e-conneq School System. Subjects-Management Page",
};




const GET_DATA = gql`
 query GetData(
   $schoolId: Decimal,
   $level: String,
   $academicYear: String,
   $subjectName: String,
   $hasSubSubjects: Boolean,
  ) {
    allSubjectsSec(
      last: 100,
      schoolId: $schoolId
      subjectName: $subjectName
      academicYear: $academicYear
      level: $level
      hasSubSubjects: $hasSubSubjects
    ){
      edges {
        node {
          id subjectCoefficient hasSubSubjects
          subsubjectList { id name assignedTo { firstName } }
          mainsubject { id subjectName }
          classroomsec { id academicYear stream level tuition }
          assignedTo { firstName }
          assignedToTwo { firstName }
        }
      }
    }
    allAcademicYearsSec
    getLevelsSec
    allSeries {
      edges {
        node {
          id name level
        }
      }
    }
  }
`;
