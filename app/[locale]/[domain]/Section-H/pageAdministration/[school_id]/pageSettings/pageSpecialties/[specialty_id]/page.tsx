import { Metadata } from 'next';
import React from 'react'
import getApolloClient, { decodeUrlID } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';

const ClassManagementPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, specialty_id: string };
  searchParams?: any
}) => {

  const client = getApolloClient(params.domain);
  let data;
  let dataTrans;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        schoolId: parseInt(params.school_id),
        specialtyId: parseInt(decodeUrlID(params.specialty_id)),
        specialtyId2: parseInt(decodeUrlID(params.specialty_id)),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error, 30)
    
    data = null;
  }
  if (searchParams && searchParams?.trans == "true"){
    try {
      const result = await client.query<any>({
        query: GET_DATA_TRANSCRIPT,
        variables: {
          schoolId: parseInt(params.school_id),
          specialtyId: parseInt(decodeUrlID(params.specialty_id)),
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      dataTrans = result.data;
    } catch (error: any) {
      console.log(error, 49)
      dataTrans = null;
    }
  }

  return (
    <div>
      <List params={params} data={data} dataTrans={dataTrans} searchParams={searchParams} />
    </div>
  )
}

export default ClassManagementPage



export const metadata: Metadata = {
  title:
    "Class-Management",
  description: "This is Class-Management Page",
};



const GET_DATA = gql`
 query GetData(
   $specialtyId2: ID!,
   $specialtyId: Decimal,
   $schoolId: Decimal!,
  ) {
    allSchoolFees(
      last: 100,
      specialtyId: $specialtyId,
      schoolId: $schoolId,
      isActive: true
    ){
      edges {
        node {
          id
          userprofile {
            user {
              fullName
              matricle
              pob
              dob
            }
            specialty {
              academicYear
              level {
                level
              }
              mainSpecialty {
                specialtyName
                field {
                  fieldName
                  domain {
                    domainName
                  }
                }
              }
              school {
                campus
                schoolName
                niu
                email
                poBox
                town
                telephone
                country
              }
            }
            active
          }
          platformPaid
        }
      }
    }
    allCourses(
      last: 100,
      specialtyId: $specialtyId
    ){
      edges {
        node {
          id
          courseCode
          courseCredit
          courseType
          semester
          completed
          assigned
          assignedTo { fullName}
          mainCourse { id courseName }
          specialty { academicYear level { level} mainSpecialty { specialtyName}}
          countTotal
          countSubmittedCa
          countSubmittedExam
          countSubmittedResit
          countValidated
          countResit
          countMissingAverage
          percentageCa
          percentageExam
          percentageResit
        }
      }
    }
    allSpecialties(
      last: 10,
      id: $specialtyId2
    ){
      edges {
        node {
          id 
          academicYear
          level { level}
          mainSpecialty { specialtyName}
          registration
          tuition
          paymentOne
          paymentTwo
          paymentThree
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
    allAcademicYears
  }
`;

const GET_DATA_TRANSCRIPT = gql`
  query GetData(
    $schoolId: ID!,
    $specialtyId: ID!,
    ) {
    resultDataSpecialtyTranscript(
      schoolId: $schoolId, 
      specialtyId: $specialtyId
    ) {
      specialtyAndSchoolInfo {
        domainName
        fieldName
        schoolCountry
        schoolEmail
        schoolName
        schoolNiu
        schoolLogo
        schoolPoBox
        schoolTelephone
        schoolRegion
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
