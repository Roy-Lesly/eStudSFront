import { Metadata } from 'next';
import React, { FC } from 'react'
import { decodeUrlID } from '@/functions';
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

  const p = await params
  const sp = await searchParams

  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      courseId: parseInt(decodeUrlID(p.course_id)),
            specialtyId: parseInt(decodeUrlID(sp.spec)),
            semester: sp.sem,
            schoolId: p.school_id,
    },
  });


  return (
    <div>
    <List params={p} data={data} searchParams={sp} />
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
  $courseId: Decimal
  $specialtyId: Decimal!
  $semester: String!
) {
  allResults(
    courseId: $courseId
  ){
    edges {
      node {
        id 
        infoData
        course { mainCourse { courseName} assignedTo { fullName}}
        student { customuser { fullName} specialty { level { level} mainSpecialty { specialtyName} academicYear}}
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
