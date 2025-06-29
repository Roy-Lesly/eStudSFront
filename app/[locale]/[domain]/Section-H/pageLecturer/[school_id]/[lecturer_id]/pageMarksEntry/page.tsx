import React from 'react'
// import List from './List'
import { gql } from '@apollo/client'
import getApolloClient, { errorLog, getAcademicYear, removeEmptyFields } from '@/functions'
import { Metadata } from 'next';
import List from './List';

export const metadata: Metadata = {
  title: "Marks-Entry Page",
  description: "This is Marks-Entry Page Lecturer Settings",
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

  const presentAcademicYear = getAcademicYear()
  const paginationParams: Record<string, any> = {};

  paginationParams.courseName = sp?.courseName ? sp.courseName : ""
  paginationParams.semester = sp?.semester ? sp.semester : ""
  paginationParams.level = sp?.level ? sp.level : ""
  paginationParams.academicYear = sp?.academicYear ? sp.academicYear : presentAcademicYear
  const client = getApolloClient(p.domain);

  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        // ...removeEmptyFields(paginationParams),
        academicYear: sp?.academicYear ? sp.academicYear : presentAcademicYear,
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

  console.log(data);

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
  $academicYear: String,
  $level: Decimal,
  $schoolId: Decimal!,
  $assignedToId: Decimal!,
  $semester: String,
) {
  allCourses(
    courseName: $courseName
    academicYear: $academicYear
    level: $level
    assignedToId: $assignedToId
    schoolId: $schoolId
    semester: $semester
    last: 100
  ) {
    edges {
      node {
        id
        courseCode
        courseCredit
        courseType
        assigned
        semester
        assignedTo { fullName}
        mainCourse { courseName}
        specialty { id academicYear level { level} mainSpecialty {specialtyName} }
      }
    }
  }
}
`;

