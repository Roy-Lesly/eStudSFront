import { Metadata } from 'next';
import React from 'react'
import getApolloClient, { decodeUrlID } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';

const CourseManagementPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, course_id: string };
  searchParams?: any
}) => {

  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        schoolId: parseInt(params.school_id),
        courseId: parseInt(decodeUrlID(params.course_id)),
        courseId2: parseInt(decodeUrlID(params.course_id)),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error, 30)
    data = null;
  }

  console.log(data)

  return (
    <div>
      <List params={params} data={data} searchParams={searchParams} />
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
