import { Metadata } from 'next';
import React from 'react'
import getApolloClient, { errorLog, removeEmptyFields } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';

const EditPage = async ({
  params,
  searchParams,
}: {
    params: any;
    searchParams: any;
}) => { const p = await params; const sp = await searchParams;

  const paginationParams: Record<string, any> = { };
  
  paginationParams.courseName = sp?.courseName
  paginationParams.specialtyName = sp?.specialtyName
  paginationParams.level = sp?.level
  paginationParams.domainName = sp?.domainName
  paginationParams.academicYear = sp?.academicYear ? sp?.academicYear :`${new Date().getFullYear()}` 
    const client = getApolloClient(p.domain);
    let data;
    let dataAdmin;
    try {
        const result = await client.query<any>({
          query: GET_DATA,
          variables: {
            ...removeEmptyFields(paginationParams),
            schoolId: p.school_id,
            timestamp: new Date().getTime()
          },
          fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
      errorLog(error)
    }
    try {
        const result = await client.query<any>({
          query: GET_DATA_ADMIN,
          variables: {
            schoolId: p.school_id,
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
    <List params={p} data={data} searchParams={sp} admins={dataAdmin} />
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
