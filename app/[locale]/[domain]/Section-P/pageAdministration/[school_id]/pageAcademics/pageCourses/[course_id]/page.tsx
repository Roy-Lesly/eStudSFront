import { Metadata } from 'next';
import React from 'react'
import getApolloClient, { decodeUrlID, errorLog } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';

const CourseManagementPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(p.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        schoolId: parseInt(p.school_id),
        courseId: parseInt(decodeUrlID(p.course_id)),
        courseId2: parseInt(decodeUrlID(p.course_id)),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error);
    data = null;
  }

  return (
    <div>
      <List params={p} data={data} searchParams={sp} />
    </div>
  )
}

export default CourseManagementPage



export const metadata: Metadata = {
  title: "Course-Management",
  description: "This is Course-Management Page",
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
          info
          logs
          student {
            user { fullName matricle }
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
