import { Metadata } from 'next';
import React, { FC } from 'react'
import { decodeUrlID, getData } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(p.domain);
  let data;
  try {
    if (sp?.spec && p.course_id) {
      const result = await client.query<any>({
        query: GET_DATA,
        variables: {
          courseId: parseInt(p.course_id),
          specialtyId: parseInt(decodeUrlID(sp.spec)),
          semester: sp.sem,
          schoolId: p.school_id,
          schoolId2: p.school_id,
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      data = result.data;
    }
  } catch (error: any) {
    errorLog(error);

    data = null;
  }

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
  description: "e-conneq School System. Marks Page",
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
        id infoData
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
