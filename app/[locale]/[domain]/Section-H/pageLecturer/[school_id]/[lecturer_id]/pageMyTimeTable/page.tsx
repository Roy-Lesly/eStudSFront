import React from 'react'
// import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { Metadata } from 'next';
import List from './List';

export const metadata: Metadata = {
  title: "My-Courses Page",
  description: "This is My-Courses Page Admin Settings",
};
const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = {};

  paginationParams.courseName = searchParams?.courseName ? searchParams.courseName : ""
  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        ...paginationParams,
        assignedToId: params.lecturer_id,
        schoolId: params.school_id,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error,32)
    
    data = null;
  }

  return (
    <div>
      <List params={params} data={data} />
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

