import { Metadata } from 'next';
import React, { FC } from 'react'
import getApolloClient, { decodeUrlID, getData } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string, course_id: string, domain: string };
  searchParams?: any
}) => {

    const client = getApolloClient(params.domain);
    let data;
    try {
      if (searchParams?.spec && params.course_id){
        const result = await client.query<any>({
          query: GET_DATA,
          variables: {
            courseId: parseInt(params.course_id),
            specialtyId: parseInt(decodeUrlID(searchParams.spec)),
            semester: searchParams.sem,
            schoolId: params.school_id,
            schoolId2: params.school_id,
            timestamp: new Date().getTime()
          },
          fetchPolicy: 'no-cache'
        });
        data = result.data;
      }
    } catch (error: any) {
      console.log(error)
      
      data = null;
    }
  
    console.log(data, 41)


  return (
    <div>
    <List params={params} data={data} searchParams={searchParams} />
  </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Select-Marks",
  description: "This is Marks Page",
};




const GET_DATA = gql`
 query GetAllData(
  $schoolId: ID
  $schoolId2: Decimal
  $courseId: Decimal
  $specialtyId: Decimal!
  $semester: String!
) {
  allResults(
    courseId: $courseId
    schoolId: $schoolId2
  ){
    edges {
      node {
        id info
        course { mainCourse { courseName} assignedTo { fullName}}
        student { user { fullName} specialty { level { level} mainSpecialty { specialtyName} academicYear}}
      }
    }
  }
  allPublishes(
    specialtyId: $specialtyId
    semester: $semester
  ) {
    edges {
      node {
        id 
        semester
        ca
        exam
        resit
        portalCa
        portalExam
        portalResit
        specialty {
          id
          academicYear
          level { level}
          mainSpecialty {
            specialtyName
          }
        }
      }
    }
  }
  allSchoolInfos(
    id: $schoolId
  ) {
    edges {
      node {
        id schoolfeesControl caLimit examLimit resitLimit
      }
    }
  }
}
`;
