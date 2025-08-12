import { Metadata } from 'next';
import React from 'react'
import { decodeUrlID } from '@/functions';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
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

  const dataAssignedSubjects = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_SUBJECTS,
    variables: {
      classroomprimId: parseInt(decodeUrlID(sp?.classId)),
      schoolId: p.school_id,
    },
  });

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_CLASSROOM_PRIM,
    variables: {
      id: parseInt(decodeUrlID(sp?.classId)),
      schoolId: p.school_id,
    },
  });

  const dataMainSubjects = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_MAIN_SUBJECTS
  });

  return (
    <div>
      <List
        params={p}
        apiClassroom={data?.allClassroomsPrim?.edges?.[0]}
        allMainSubjects={dataMainSubjects?.allMainSubjectPrim?.edges}
        dataAssignedSubjects={dataAssignedSubjects?.allSubjectsPrim?.edges}
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



const GET_DATA_MAIN_SUBJECTS = gql`
 query GetData {
    allMainSubjectPrim(
      last: 200
    ){
      edges {
        node {
          id 
          subjectName
        }
      }
    }
  }
`;

const GET_DATA_SUBJECTS = gql`
 query GetData (
    $classroomprimId: Decimal! 
 ) {
    allSubjectsPrim (
      classroomprimId: $classroomprimId
      last: 200
    ){
      edges {
        node {
            id 
            mainsubjectprim {
              id subjectName
            }
        }
      }
    }
  }
`;



const GET_DATA_CLASSROOM_PRIM = gql`
 query GetData(
   $id: ID,
   $schoolId: Decimal,
   $academicYear: String,
   $level: String,
  ) {
    allClassroomsPrim(
      last: 100,
      id: $id
      schoolId: $schoolId
      academicYear: $academicYear
      level: $level
    ){
      edges {
        node {
          id 
          academicYear
          school { id }
          level
          registration tuition paymentOne paymentTwo paymentThree
          school { campus}
          studentCount
        }
      }
    }
    allAcademicYearsPrim
    getLevelsPrim
  }
`;
