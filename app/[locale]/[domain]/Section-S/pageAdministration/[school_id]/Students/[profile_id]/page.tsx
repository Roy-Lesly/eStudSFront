import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { AllMainSubject } from '@/Domain/schemas/interfaceGraphqlSecondary'
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

  console.log(params, 23)

  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<AllMainSubject>({
      query: GET_DATA,
      variables: {
        id: params.profile_id,
        profId: parseInt(params.profile_id),
        prof2Id: parseInt(params.profile_id),
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

  console.log(data)


  return (
    <div>
      <List params={params} data={data} />
    </div>
  )
}

export default page


const GET_DATA = gql`
 query GetAllData(
  $id: ID!,
  $profId: Int!,
  $prof2Id: Decimal!,
  $schoolId: Decimal!,
) {
  allUserprofileSec(
    id: $id
    schoolId: $schoolId
    last: 5
  ) {
    edges {
      node {
        id 
        active 
        user { firstName lastName fullName sex telephone address email dob pob parent parentTelephone isActive } 
        classroom { 
          stream academicYear registration tuition paymentOne paymentTwo paymentThree option 
          school { campus }
          level { level }
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
  allClassroomsByUserProfileSec(
    userProfileSecId: $profId
  ){
    academicYear
    option
    stream 
    level {level }
    school {campus }
  }
  allSchoolFeesSec(
    userprofilesecId: $prof2Id
  ) {
    edges {
      node {
        id
        platformPaid
        idPaid
        balance
        userprofilesec {
          classroom {
            level {
              level
            }
            academicYear
            paymentOne
            paymentThree
            paymentTwo
            registration
            tuition
            stream
          }
        }
        transactionssecSet {
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
  allResultsSecondary(
    studentId: $prof2Id
  ) {
    edges {
      node {
        id 
        student { 
          user { fullName}
          classroom { 
            academicYear
            stream
            level { level}
          }
        }
        subject { mainSubject { subjectName}}
        info
      }
    }
  }
}
`;

