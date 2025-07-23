import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import { decodeUrlID } from '@/functions'
import { Metadata } from 'next';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

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

  const p = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
        // id: params.profile_id,
        // userprofileprimId: parseInt(decodeUrlID(p.student_id)),
        // customuserId: parseInt(decodeUrlID(sp.user)),
        schoolId: p.school_id,
        parentTelephone: sp?.ft || sp?.mt,
    },
  });


  return (
    <div>
      <List
        p={p}
        data={data}
        sp={sp} />
    </div>
  )
}

export default page


const GET_DATA = gql`
 query GetData(
    $customuserId: Decimal,
    $userprofileprimId: Decimal,
    $schoolId: Decimal!
    $parentTelephone: String!
) {
    allSchoolFeesPrim(
      customuserId: $customuserId, 
      first: 10, 
      schoolId: $schoolId
      parentTelephone: $parentTelephone
    ) {
      edges {
        node {
          id
          platformPaid
          idPaid
          balance
          userprofileprim {
            id
            infoData
            customuser { 
              id role fullName matricle firstName lastName photo sex dob pob email telephone address
              fatherName motherName fatherTelephone motherTelephone parentAddress about photo
              nationality highestCertificate yearObtained regionOfOrigin infoData password
            }
            classroomprim { 
              id
              academicYear
              registration
              tuition
              paymentOne
              paymentTwo
              paymentThree
              level
              school { schoolName campus colors schoolIdentification { logo platformCharges idCharges } schoolfeesControl }
            }
            programprim
          }
          transactionsprim {
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
    getProgramsPrim
    allResultsPrim(
      studentId: $userprofileprimId
      active: true
    ) {
      edges {
        node {
          id 
          infoData
          student { 
            customuser { fullName}
            classroomprim { 
              academicYear
              level
            }
          }
          subjectprim { id mainsubjectprim { subjectName}}
          createdBy { id}
          updatedBy { id}
        }
      }
    }
  }
`;

