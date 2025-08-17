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
      userprofileId: parseInt(decodeUrlID(p.student_id)),
      customuserId: parseInt(decodeUrlID(sp.user)),
      schoolId: p.school_id,
    },
  });

  return (
    <div>
      <List
        params={p}
        data={data}
        sp={sp}
      />
    </div>
  )
}

export default page


const GET_DATA = gql`
 query GetData(
    $customuserId: Decimal,
    $userprofileId: Decimal,
    $schoolId: Decimal!
) {
    allSchoolFees(
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
          userprofile {
            id
            session
            infoData
            customuser { 
              id role matricle firstName lastName photo sex dob pob email telephone address fullName 
              fatherName fatherTelephone motherName motherTelephone parentAddress about photo
              nationality highestCertificate yearObtained regionOfOrigin infoData
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
              school { schoolName campus colors logoCampus schoolIdentification { logo platformCharges idCharges } schoolfeesControl }
            }
            program { id name }
          }
          transactions {
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
          infoData
          student { 
            customuser { fullName}
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

