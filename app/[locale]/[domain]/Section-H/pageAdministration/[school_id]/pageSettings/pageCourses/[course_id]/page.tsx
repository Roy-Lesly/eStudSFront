import { Metadata } from 'next';
import React from 'react'
import { decodeUrlID } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const CourseManagementPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any
}) => {

  const p = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      schoolId: parseInt(p.school_id),
      courseId: parseInt(decodeUrlID(p.course_id)),
      courseId2: parseInt(decodeUrlID(p.course_id)),
      timestamp: new Date().getTime()
    }
  });

  return (
    <div>
      <List params={p} data={data} searchParams={sp} />
    </div>
  )
}

export default CourseManagementPage



export const metadata: Metadata = {
  title: "Course-Management",
  description: "e-conneq School System. Course-Management Page",
};



const GET_DATA = gql`
 query GetData(
   $courseId: ID!,
   $courseId2: Decimal!,
   $schoolId: Decimal!
  ) {
    allResults(
      last: 200,
      courseId: $courseId2
    ){
      edges {
        node {
          id
          infoData
          logs
          student {
            customuser { fullName matricle }
          }
          course {
            mainCourse { id courseName }
            specialty { academicYear level { level} mainSpecialty { specialtyName}}
          }
        }
      }
    }
    allCourses(
      last: 10,
      schoolId: $schoolId,
      id: $courseId
    ){
      edges {
        node {
          id
          courseCode
          courseCredit
          courseType
          semester
          completed
          assigned
          assignedTo { fullName}
          mainCourse { id courseName }
          specialty { academicYear level { level} mainSpecialty { specialtyName}}
          countTotal
          countSubmittedCa
          countSubmittedExam
          countSubmittedResit
          countValidated
          countFailed
          countResit
          countMissingAverage
          countWithAverage
        }
      }
    }
  }
`;
