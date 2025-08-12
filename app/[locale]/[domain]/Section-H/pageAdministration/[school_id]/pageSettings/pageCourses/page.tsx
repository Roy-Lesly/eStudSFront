import { Metadata } from 'next';
import React from 'react'
import { removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {
  const p = await params; const sp = await searchParams;

  const paginationParams: Record<string, any> = {};

  paginationParams.courseName = sp?.courseName
  paginationParams.specialtyName = sp?.specialtyName
  paginationParams.level = sp?.level
  paginationParams.domainName = sp?.domainName
  paginationParams.academicYear = sp?.academicYear ? sp?.academicYear : `${new Date().getFullYear()}`

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      roleIn: ["admin", "teacher"],
      isStaff: false,
      isActive: true,
      schoolId: parseInt(p.school_id),
    },
  });


  return (
    <div>
      <List
        params={p}
        data={data}
        searchParams={sp}
        users={data?.allCustomusers?.edges}
      />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title: "Courses-Settings",
  description: "e-conneq School System. Courses-Settings Page",
};


const GET_DATA = gql`
 query GetData(
   $schoolId: Decimal,
   $specialtyName: String,
   $domainName: String,
   $courseName: String,
   $academicYear: String,
   $roleIn: [String!]!,
   $isStaff: Boolean!,
   $isActive: Boolean!,
   $level: Decimal,
  ) {
    allCourses(
      last: 100,
      schoolId: $schoolId
      specialtyName: $specialtyName
      domainName: $domainName
      courseName: $courseName
      academicYear: $academicYear
      level: $level
    ){
      edges {
        node {
          id 
          courseCode
          courseCredit
          courseType
          semester
          hours
          hoursLeft
          assignedTo { id fullName }
          mainCourse {
            id
            courseName
          }
          specialty {
            id
            academicYear
            level {
              level
            }
            mainSpecialty {
              specialtyName
            }
            registration tuition paymentOne paymentTwo paymentThree
            school { campus}
          }
          countResit
        }
      }
    }
    allMainCourses(
      last: 1000,
      courseName: $courseName
    ){
      edges {
        node {
          id 
          courseName
        }
      }
    }
    allDomains(
      last: 100,
    ){
      edges {
        node {
          id 
          domainName
        }
      }
    }
    allSpecialties(
      schoolId: $schoolId
      last: 300,
    ){
      edges {
        node {
          id 
          academicYear
          level { level}
          mainSpecialty { specialtyName}
        }
      }
    }
    allCustomusers(
      schoolId: $schoolId
      isStaff: $isStaff
      isActive: $isActive
      roleIn: $roleIn
      last: 500,
    ){
      edges {
        node {
          id 
          fullName
        }
      }
    }
    allLevels(
      last: 10,
    ){
      edges {
        node {
          id 
          level
        }
      }
    }
    allAcademicYears
  }
`;
