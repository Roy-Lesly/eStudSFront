import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import { Metadata } from 'next';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

export const metadata: Metadata = {
  title: "Marks - Course",
  description: "e-conneq School System. Marks - Course Admin Settings",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;


  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      assignedToId: p?.lecturer_id ? parseInt(p.lecturer_id) : "",
      academicYear: sp?.academicYear ? sp.academicYear : new Date().getFullYear().toString(),
      schoolId: p.school_id
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
  $schoolId: Decimal!,
  $assignedToId: Decimal,
  $academicYear: String!,
) {
  allCourses (
    schoolId: $schoolId
    assignedToId: $assignedToId
    academicYear: $academicYear
  ) {
    edges {
      node {
        id 
        percentageCa
        percentageResit
        percentageExam
        semester
        courseCode
        semester
        assignedTo { fullName}
        specialty {
          id
          academicYear
          school {
            campus
          }
          level {
            level
          }
          mainSpecialty {
            specialtyName
          }
        }
        mainCourse {
          courseName
        }
      }
    }
  }
}
`;

