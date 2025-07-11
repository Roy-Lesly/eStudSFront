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
      schoolId: parseInt(p.school_id),
    },
  });

  const dataAdmin = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_ADMIN,
    variables: {
      schoolId: parseInt(p.school_id),
    },
  });


  return (
    <div>
      <List
        params={p}
        data={data}
        searchParams={sp}
        admins={dataAdmin}
      />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title: "Courses-Settings",
  description: "This is Courses-Settings Page",
};


const GET_DATA_ADMIN = gql`
 query GetData(
   $schoolId: Decimal
  ) {
    allCustomusers(
      schoolId: $schoolId
      role: "admin"
      last: 500,
      isStaff:false
    ){
      edges {
        node {
          id 
          fullName
        }
      }
    }
  }
`


const GET_DATA = gql`
 query GetData(
   $schoolId: Decimal,
   $specialtyName: String,
   $domainName: String,
   $courseName: String,
   $academicYear: String,
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
      role: "teacher"
      last: 500,
      isActive: true,
      isStaff:false
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
