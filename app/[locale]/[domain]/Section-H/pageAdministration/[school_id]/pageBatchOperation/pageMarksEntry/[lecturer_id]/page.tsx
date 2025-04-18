import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Marks - Course",
  description: "This is Marks - Course Admin Settings",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

console.log(params)
console.log(searchParams)

  const paginationParams: Record<string, any> = {};

  paginationParams.academmicYear = searchParams?.academmicYear ? searchParams.academmicYear : ""
  paginationParams.assignedToId = params?.lecturer_id ? parseInt(params.lecturer_id ): ""
  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        ...paginationParams,
        schoolId: params.school_id,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error, 41)
    if (error.networkError && error.networkError.result) {
      console.error('GraphQL Error Details:', error.networkError.result.errors);
    }
    data = null;
  }


  console.log(data, 49)

  return (
    <div>
      <List params={params} data={data} />
    </div>
  )
}


export default page


const GET_DATA = gql`
 query GetAllData(
  $schoolId: Decimal,
  $academicYear: String,
  $assignedToId: Decimal!,
) {
  allCourses(
  schoolId: $schoolId
  assignedToId: $assignedToId
  academicYear: $academicYear
  last: 100
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
        resultSet {
          student { user { fullName} specialty { level { level} mainSpecialty { specialtyName} academicYear} }
        }
      }
    }
  }
}
`;

