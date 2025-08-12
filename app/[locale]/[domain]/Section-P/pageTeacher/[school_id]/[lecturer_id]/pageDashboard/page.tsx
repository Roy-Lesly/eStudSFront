import React from 'react'
// import List from './List'
import { gql } from '@apollo/client'
import { getAcademicYear, removeEmptyFields } from '@/functions'
import { Metadata } from 'next';
import List from './List';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

export const metadata: Metadata = {
  title: "Dashboard Page",
  description: "e-conneq School System. Dashboard Page Lecturer",
};
const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params
  const sp = await searchParams

  const presenetAcademicYear = getAcademicYear()
  const paginationParams: Record<string, any> = {};

  paginationParams.courseName = sp?.courseName ? sp.courseName : ""
  paginationParams.semester = sp?.semester ? sp.semester : ""
  paginationParams.level = sp?.level ? sp.level : ""
  paginationParams.academicYear = sp?.academicYear ? sp.academicYear : presenetAcademicYear
  const client = getApolloClient(p.domain);

  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        ...removeEmptyFields(paginationParams),
        assignedToId: p.lecturer_id,
        schoolId: p.school_id,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error)

    data = null;
  }

  return (
    <div>
      <List params={p} data={data} />
    </div>
  )
}

export default page


const GET_DATA = gql`
 query GetAllData(
  $courseName: String,
  $schoolId: Decimal!,
  $assignedToId: Decimal!,
) {
  allCourses(
    courseName: $courseName
    assignedToId: $assignedToId
    schoolId: $schoolId
  ) {
    edges {
      node {
        id
        courseCode
        courseCredit
        courseType
        assigned
        assignedTo { fullName}
        mainCourse { courseName}
      }
    }
  }
}
`;

