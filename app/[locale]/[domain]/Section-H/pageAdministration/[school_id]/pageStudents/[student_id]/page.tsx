import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient, { decodeUrlID } from '@/functions'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Info Page",
  description: "This is Info Page Admin Settings",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        id: params.profile_id,
        userprofileId: parseInt(decodeUrlID(params.student_id)),
        userId: parseInt(decodeUrlID(searchParams.user)),
        schoolId: params.school_id,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error)
    
    data = null;
  }

  console.log("Student => Info")


  return (
    <div>
      <List params={params} data={data} searchParams={searchParams} />
    </div>
  )
}

export default page


const GET_DATA = gql`
 query GetData(
    $userprofileId: Decimal,
    $userId: Decimal,
    $first: Int,
    $schoolId: Decimal!
) {
    allSchoolFees(
      userId: $userId, 
      first: $first, 
      schoolId: $schoolId
    ) {
      edges {
        node {
          id
          platformPaid
          idPaid
          balance
          userprofile {
            id
            session
            code
            info
            user { 
              id role matricle firstName lastName photo sex dob pob email telephone address fullName parent parentTelephone about photo
              nationality highestCertificate yearObtained regionOfOrigin
            }
            specialty { 
              id
              academicYear
              registration
              tuition
              paymentOne
              paymentTwo
              paymentThree
              mainSpecialty { specialtyName }
              level { level }
              school { schoolName campus colors schoolIdentification { logo platformCharges } schoolfeesControl }
            }
            program { id name }
          }
          transactionsSet {
            edges {
              node {
                amount
                createdAt
                paymentMethod
                reason
                ref
                status
                createdAt
              }
            }
          }
        }
      }
    }
    allPrograms {
      edges {
        node { id name }
      }
    }
    allResults(
      studentId: $userprofileId
    ) {
      edges {
        node {
          id 
          info
          student { 
            user { fullName}
            specialty { 
              academicYear
              level { level}
              mainSpecialty {
                specialtyName
              }
            }
          }
          course { semester mainCourse { courseName}}
        }
      }
    }
  }
`;

