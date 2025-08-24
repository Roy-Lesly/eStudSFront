import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import { decodeUrlID } from '@/functions'
import { Metadata } from 'next';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

export const metadata: Metadata = {
  title: "Info Page",
  description: "e-conneq School System. Info Page Admin Settings",
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
      id: params.profile_id,
      userprofilesecId: parseInt(decodeUrlID(p.student_id)),
      customuserId: parseInt(decodeUrlID(sp.user)),
      schoolId: p.school_id,
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
    $userprofilesecId: Decimal,
    $schoolId: Decimal!
) {
    allSchoolFeesSec(
      customuserId: $customuserId, 
      first: 10, 
      schoolId: $schoolId
    ) {
      edges {
        node {
          id
          platformPaid
          idPaid
          balance
          userprofilesec {
            id
            session
            infoData
            customuser { 
              id role fullName matricle firstName lastName photo sex dob pob email telephone address
              fatherName motherName fatherTelephone motherTelephone parentAddress about photo
              nationality highestCertificate yearObtained regionOfOrigin infoData password
            }
            classroomsec { 
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
            programsec
          }
          transactionssec {
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
    getProgramsSec
    allResultsSec(
      studentId: $userprofilesecId
      active: true
    ) {
      edges {
        node {
          id 
          infoData
          student { 
            customuser { fullName}
            classroomsec { 
              academicYear
              level
            }
          }
          subjectsec { id mainsubject { subjectName}}
          createdBy { id}
          updatedBy { id}
        }
      }
    }
  }
`;

