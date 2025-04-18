import getApolloClient from '@/functions';
import { GetPublishInter } from '@/Domain/Utils-H/appControl/appInter';
import { Metadata } from 'next';
import React from 'react'
import { GrClose, GrStatusGood } from 'react-icons/gr';
import { gql } from '@apollo/client';
import { EdgePublish, EdgeResult, EdgeSchoolFees, EdgeTranscriptApplications } from '@/Domain/schemas/interfaceGraphql';
import logger from '@/logger';
import DisplayPage from './DisplayPage';


interface GetDataResponse {
    allSchoolFees: {
        edges: EdgeSchoolFees[]
    }
    allResults: {
        edges: EdgeResult[]
    }
    allPublishes: {
        edges: EdgePublish[]
    }
    allTranscriptApplications: {
        edges: EdgeTranscriptApplications[]
    }
}

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
            user { 
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
          id info course { semester mainCourse { courseName }}  
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
            id printCount status userprofile { user { fullName } specialty { academicYear level { level} mainSpecialty { specialtyName}}}
        }
      }
    }
  }
`;


export const metadata: Metadata = {
    title: "Transcript Page",
    description: "Student Transcript Page",
};

const page = async ({
    params,
    searchParams,
}: {
    params: { userprofile_id: string, domain: string, specialty_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  console.log(parseInt(params.userprofile_id))
  console.log(parseInt(params.specialty_id))

    const client = getApolloClient(params.domain);
    let data;
    try {
        const result = await client.query<GetDataResponse>({
            query: GET_DATA,
            variables: {
                userprofileId: parseInt(params.userprofile_id),
                specialtyId: parseInt(params.specialty_id),
            },
            fetchPolicy: 'no-cache'
        });

        data = result.data;
    } catch (error: any) {
        // console.log(error, 111)
        data = null;
    }

    console.log(data, 117)

    return (
        <div className='h-screen mb-2 mt-2 rounded text-black'>

            <DisplayPage data={data} params={params} />

        </div>
    )

}

export default page
