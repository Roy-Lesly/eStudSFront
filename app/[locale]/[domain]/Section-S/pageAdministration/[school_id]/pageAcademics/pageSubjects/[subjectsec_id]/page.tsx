import { Metadata } from 'next';
import React from 'react'
import { decodeUrlID } from '@/functions';
import { gql } from '@apollo/client';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';
import List from './List';
// import ComingSoon from '@/components/ComingSoon';

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
        id: parseInt(decodeUrlID(p.subjectsec_id)),
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error)

    data = null;
  }

  return (
    <div>
      {/* <ComingSoon /> */}
      <List
        p={p}
        data={data}
        sp={sp}
      />
    </div>
  )
}

export default ClassManagementPage



export const metadata: Metadata = {
  title:
    "Class-Management",
  description: "e-conneq School System. Class-Management Page",
};



const GET_DATA = gql`
 query GetData(
   $id: ID!,
  ) {
    allSubjectsSec (
      id: $id
    ) {
      edges {
        node {
          id
          assignedTo { id fullName }
          assignedToTwo { id fullName }
          mainsubject { id subjectName subjectCode }
          subsubjectList { id name assignedTo { id fullName } }
        }
      }
    }
    allResultsSec(
      last: 150,
      id: $id,
      active: true
    ){
      edges {
        node {
          id active
          student {
            customuser {
              fullName
              matricle
              pob
              dob
            }
            classroomsec {
              academicYear
              level
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
          }
        }
      }
    }
    allAcademicYearsSec
  }
`;
