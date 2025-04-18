import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { decodeUrlID } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, school_fees_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const client = getApolloClient(params.domain);
  let dataTrans;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        schoolId: parseInt(params.school_id),
        schoolFeesId: parseInt(decodeUrlID(params.school_fees_id))
      },
      fetchPolicy: 'no-cache'
    });
    dataTrans = result.data;
  } catch (error: any) {
    console.log(error)
    dataTrans = null;
  }

  return (
    <div>
      <List params={params} dataTrans={dataTrans?.resultDataSpecialtyTranscript} searchParams={searchParams} />
      </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Transcript",
  description: "This is Transcript Page",
};




const GET_DATA = gql`
  query GetData(
    $schoolId: ID!,
    $schoolFeesId: ID
    ) {
      resultDataSpecialtyTranscript(
        schoolId: $schoolId, 
        schoolFeesId: $schoolFeesId
    ) {
      specialtyAndSchoolInfo {
      domainName
      fieldName
      schoolCountry
      schoolEmail
      schoolName
      schoolNiu
      schoolPoBox
      schoolTelephone
      schoolRegion
      schoolLogo
      specialtyAcademicYear
      specialtyLevel
      specialtyName
    }
    resultDataSpecialtyTranscript {
      general {
        GPA
        gradeSystem
        gpaTotal
        totalAttempted
        totalEarned
      }
      profileId
      profileCode
      fullName
      matricle
      dob
      pob
      program
      platform
      perSemester {
        gpaTotal
        semAttemptedCredit
        semCreditEarned
        semTotalCredit
        semGP
        semester
      }
      results {
        GD
        GP
        WP
        courseCode
        average
        courseCredit
        courseName
        resit
        semester
      }
    }
    }
  }
`;