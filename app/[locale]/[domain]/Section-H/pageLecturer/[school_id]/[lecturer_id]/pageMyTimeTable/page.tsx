import React from 'react'
// import List from './List'
import { gql } from '@apollo/client'
import { Metadata } from 'next';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

export const metadata: Metadata = {
  title: "My-Courses Page",
  description: "e-conneq School System. My-Courses Page Admin Settings",
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

  const paginationParams: Record<string, any> = {};

  paginationParams.courseName = sp?.courseName ? sp.courseName : ""

  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      ...paginationParams,
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
  $schoolId: Decimal!,
  $assignedToId: Decimal!,
) {
  allCourses(
    courseName: $courseName
    assignedToId: $assignedToId
    schoolId: $schoolId
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
      }
    }
  }
}
`;

