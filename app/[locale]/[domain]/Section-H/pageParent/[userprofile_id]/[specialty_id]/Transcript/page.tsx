import { Metadata } from 'next';
import React from 'react'
import { gql } from '@apollo/client';
import DisplayPage from './DisplayPage';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';



export const metadata: Metadata = {
  title: "Transcript Page",
  description: "Student Transcript Page",
};

const page = async ({
  params,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      userprofileId: parseInt(p.userprofile_id),
      specialtyId: parseInt(p.specialty_id),
    },
  });

  return (
    <div className='h-screen mb-2 mt-2 rounded text-black'>

      <DisplayPage data={data} params={p} />

    </div>
  )

}

export default page



const GET_DATA = gql`
 query GetAllData(
    $userprofileId: Decimal,
    $specialtyId: Decimal
  ) {
    allSchoolFees(first: 1, userprofileId: $userprofileId) {
      edges {
        node {
          id
          balance
          platformPaid
          userprofile {
            id
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
              school { schoolIdentification { platformCharges } schoolfeesControl}
            }
            program { id name }
          }
        }
      }
    }
    allResults(first: 50, studentId: $userprofileId,) {
      edges {
        node {
          id infoData course { semester mainCourse { courseName }}  
        }
      }
    }
    allPublishes(first: 4, specialtyId: $specialtyId, ca: true, exam: true, resit: true) {
      edges {
        node {
            id semester specialty { mainSpecialty { specialtyName}}
        }
      }
    }
    allTranscriptApplications (
      userprofileId: $userprofileId
    ) {
      edges {
        node {
            id printCount status
            userprofile { 
              customuser { fullName }
              specialty { academicYear level { level} mainSpecialty { specialtyName}}
              }
        }
      }
    }
  }
`;
