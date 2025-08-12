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

  const paginationParams: Record<string, any> = {};

  const dataAssignedSubjects = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_SUBJECTS,
    variables: {
      classroomsecId: parseInt(decodeUrlID(sp?.classId)),
      schoolId: p.school_id,
    },
  });

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_CLASSROOM_SEC,
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
      {/* <pre>
            {JSON.stringify(data?.allClassroomsSec?.edges?.[0], null, 2)}
        </pre> */}
      <List
        params={p}
        data={data?.allSubjectsSec?.edges}
        allMainSubjects={dataMainSubjects?.allMainSubjectSec?.edges}
        dataAssignedSubjects={dataAssignedSubjects?.allSubjectsSec?.edges}
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
    allMainSubjectSec(
      last: 200
    ){
      edges {
        node {
          id subjectName
        }
      }
    }
  }
`;

const GET_DATA_SUBJECTS = gql`
 query GetData (
    $classroomsecId: Decimal! 
 ) {
    allSubjectsSec (
      classroomsecId: $classroomsecId
      last: 200
    ){
      edges {
        node {
            id 
            mainsubject {
                id subjectName
            }
        }
      }
    }
  }
`;



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

