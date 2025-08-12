import React from 'react'
// import List from './List'
import { gql } from '@apollo/client'
import { getAcademicYear, removeEmptyFields } from '@/functions'
import { Metadata } from 'next';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

export const metadata: Metadata = {
  title: "Marks-Entry Page",
  description: "e-conneq School System. Marks-Entry Page Lecturer Settings",
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

  paginationParams.courseName = sp?.courseName
  paginationParams.semester = sp?.semester
  paginationParams.level = sp?.level
  paginationParams.academicYear = sp?.academicYear ? sp.academicYear : presentAcademicYear

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      academicYear: sp?.academicYear ? sp.academicYear : presentAcademicYear,
      assignedToId: p.lecturer_id,
      schoolId: p.school_id,
    },
  });

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

