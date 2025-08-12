import React from 'react'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import ListResultAudit from '@/app/[locale]/[domain]/SectionAll/ListResultAudit';

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;
  let data;

  data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_PRIMARY,
    variables: {
      fullName: sp?.fullName || "",
      courseName: sp?.courseName || "",
      semester: sp?.semester || "",
      academicYear: sp?.academicYear || "",
    },
  });


  return (
    <ListResultAudit
      section={"P"}
      params={p}
      dataResults={data?.allResultsPrim?.edges}
      sp={sp}
    />
  )
}

export default page


export const metadata: Metadata = {
  title: "Management",
  description: "e-conneq School System. Manangement Page Settings",
};



const GET_DATA_PRIMARY = gql`
  query GetAllData  (
    $schoolId: Decimal,
    $fullName: String,
    $subjectName: String,
    $level: String,
    $academicYear: String
  ) {
    allResultsPrim (
      fullName: $fullName,
      subjectName: $subjectName,
      level: $level,
      academicYear: $academicYear,
      schoolId: $schoolId,
      last: 100
    ) {
      edges {
        node {
          id createdAt updatedAt logs
          subjectprim { mainsubjectprim { subjectName}}
          student {
            customuser { fullName }
            classroomprim { academicYear level }
          }
        }
      }
    }
  }
`;



