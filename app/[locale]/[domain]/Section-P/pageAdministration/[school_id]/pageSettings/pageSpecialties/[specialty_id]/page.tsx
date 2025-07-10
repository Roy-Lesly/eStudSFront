import { Metadata } from 'next';
import React from 'react'
import { decodeUrlID } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

const ClassManagementPage = async ({
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
  let dataTrans;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        schoolId: parseInt(p.school_id),
        specialtyId: parseInt(decodeUrlID(p.specialty_id)),
        specialtyId2: parseInt(decodeUrlID(p.specialty_id)),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error)
    
    data = null;
  }
  if (sp && sp?.trans == "true"){
    try {
      const result = await client.query<any>({
        query: GET_DATA_TRANSCRIPT,
        variables: {
          schoolId: parseInt(p.school_id),
          specialtyId: parseInt(decodeUrlID(p.specialty_id)),
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      dataTrans = result.data;
    } catch (error: any) {
      dataTrans = null;
    }
  }

  return (
    <div>
      <List params={p} data={data} dataTrans={dataTrans} searchParams={sp} />
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
      last: 500,
      specialtyId: $specialtyId,
      schoolId: $schoolId,
      isActive: true
    ){
      edges {
        node {
          id
          userprofile {
            customuser {
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
          resitCount { resitCount }
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
          resitCountPerCourse { totalCount resitCount }
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
          ca
          exam
          resit
          hasResit
          semester
        }
      }
    }
  }
`;
