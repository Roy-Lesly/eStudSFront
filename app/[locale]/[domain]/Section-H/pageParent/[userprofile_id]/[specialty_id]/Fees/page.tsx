import React from 'react';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import DisplayFees from '@/app/[locale]/[domain]/SectionAll/ParentStudent/DisplayFees';


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params

  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      first: 40,
      userprofileId: p.userprofile_id,
    },
  });

  return (
    <DisplayFees
      apiFees={data.allSchoolFees.edges[0]}
      apiTransactions={data.allTransactions.edges}
      apiMoratoires={data.allMoratoires.edges[0]}
      section='H'
      role='Parent'
      p={p}
    />
  )
}

export default page



const GET_DATA = gql`
 query GetAllData(
    $first: Int,
    $userprofileId: Decimal,
  ) {
    allMoratoires (
      userprofileId: $userprofileId
    ) {
      edges {
        node {
          id status
        }
      }
    }
    allSchoolFees(
      first: $first,
      userprofileId: $userprofileId
    ) {
      edges {
        node {
          id
          balance
          platformPaid
          idPaid
          userprofile {
            id infoData
            session
            customuser { 
              id matricle firstName lastName fullName
            }
            specialty { 
              id
              academicYear
              mainSpecialty { specialtyName }
              level { level }
              tuition
              paymentOne
              paymentTwo
              paymentThree
              school { 
                schoolfeesControl moratoireDeadline
                schoolIdentification { platformCharges idCharges }
                caLimit examLimit resitLimit
              }
            }
            program { id name }
          }
        }
      }
    }
    allTransactions(first: 40, userprofileId: $userprofileId) {
      edges {
        node {
          id amount reason createdAt createdBy { fullName }
        }
      }
    }
  }`;
