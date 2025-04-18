import { Metadata } from 'next';
import React from 'react'
import getApolloClient, { removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string, course_id: string, domain: string };
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = { };
  
  paginationParams.courseName = searchParams?.courseName
  paginationParams.specialtyName = searchParams?.specialtyName
  paginationParams.domainName = searchParams?.domainName
  paginationParams.academicYear = searchParams?.academicYear ? searchParams?.academicYear :`${new Date().getFullYear()}` 
    const client = getApolloClient(params.domain);
    let data;
    let dataAdmin;
    try {
        const result = await client.query<any>({
          query: GET_DATA,
          variables: {
            ...removeEmptyFields(paginationParams),
            schoolId: params.school_id,
            timestamp: new Date().getTime()
          },
          fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
      console.log(error, 35)
    }
    try {
        const result = await client.query<any>({
          query: GET_DATA_ADMIN,
          variables: {
            schoolId: params.school_id,
            timestamp: new Date().getTime()
          },
          fetchPolicy: 'no-cache'
        });
        dataAdmin = result.data;
    } catch (error: any) {
      console.log(error, 35)
      dataAdmin = null
    }

  return (
    <div>
    <List params={params} data={data} searchParams={searchParams} admins={dataAdmin} />
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
    allCustomUsers(
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
    allCustomUsers(
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
