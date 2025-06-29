import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { decodeUrlID, errorLog } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(p.domain);
  let dataTrans;
  let dataInfo;

  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        schoolFeesId: parseInt(decodeUrlID(p.fees_id)),
        number: p.number
      },
      fetchPolicy: 'no-cache'
    });
    dataTrans = result.data;
  } catch (error: any) {
    errorLog(error);
    dataTrans = null;
  }

  try {
    const result = await client.query<any>({
      query: GET_INFO,
      variables: {
        schoolFeesId: parseInt(decodeUrlID(p.fees_id)),
      },
      fetchPolicy: 'no-cache'
    });
    dataInfo = result.data;
  } catch (error: any) {
    errorLog(error);
    dataInfo = null;
  }

  console.log(dataTrans);

  return (
    <div>
      <List
        params={p}
        dataTrans={dataTrans?.transcriptCoursesResults}
        dataInfo={dataInfo?.transcriptInfo}
        searchParams={sp}
      />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Transcript",
  description: "This is Transcript Page",
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