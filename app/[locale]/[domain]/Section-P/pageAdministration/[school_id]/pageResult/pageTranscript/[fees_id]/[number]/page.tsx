import { Metadata } from 'next'
import React from 'react'
import { decodeUrlID } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'


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
      schoolFeesId: parseInt(decodeUrlID(p.fees_id)),
      number: p.number
    },
  });

  const dataInfo = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_INFO,
    variables: {
      schoolFeesId: parseInt(decodeUrlID(p.fees_id)),
    },
  });

  console.log(data);

  return (
    <div>
      <List
        params={p}
        dataTrans={data?.transcriptCoursesResults}
        dataInfo={dataInfo?.transcriptInfo}
        searchParams={sp}
      />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Transcript",
  description: "e-conneq School System. Transcript Page",
};




const GET_INFO = gql`
query GetData(
  $schoolFeesId: ID!,
  ) {
    transcriptInfo (
      schoolFeesId: $schoolFeesId
    ) {
      schoolInfo {
        eng ministry schoolName schoolLogo schoolNiu schoolEmail schoolPoBox
        schoolCountry schoolRegion schoolTelephone schoolTown schoolTelephone schoolDirector
      }
      studentInfo {
        userprofileId matricle fullName dob pob
        domain field specialtyName academicYear level program
      }
    }
  }
`;

const GET_DATA = gql`
query GetData(
  $schoolFeesId: ID!,
  $number: String!
  ) {
    transcriptCoursesResults (
      schoolFeesId: $schoolFeesId, 
      number: $number
    ) {
      academicYear
      level
      yearCreditAttempted
      yearCreditEarned
      yearGPA
      gpaSystem
      semesters {
        academicYear
        level
        semester
        semesterCreditAttempted
        semesterCreditEarned
        semesterGPA
        courses {
          academicYear
          courseName
          courseCode
          ca
          exam
          resit
          average
          CV
          GP
          WP
          GD
          hasResit
        }
      }
    }
  }
`;