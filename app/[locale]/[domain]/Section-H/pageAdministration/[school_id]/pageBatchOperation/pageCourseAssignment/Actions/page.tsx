import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'
import { EdgeSchoolHigherInfo } from '@/utils/Domain/schemas/interfaceGraphql'
import { decodeUrlID } from '@/utils/functions'


export const revalidate = 60;

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const { domain } = await params;
  const sp = await searchParams;


  const dataMainCourses = await queryServerGraphQL({
    domain,
    query: GET_DATA_MAINCOURSES,
    variables: { courseName: sp?.courseName || "" },
  });

  const dataAdmins = await queryServerGraphQL({
    domain,
    query: GET_DATA_CUSTOMUSER,
    variables: {
      schoolId: parseInt(p.school_id),
      role: "admin"
    },
  });

  const dataLects = await queryServerGraphQL({
    domain,
    query: GET_DATA_CUSTOMUSER,
    variables: {
      schoolId: parseInt(p.school_id),
      role: "teacher"
    },
  });


  return (
    <List
      params={p}
      searchParams={sp}
      apiMainCourses={dataMainCourses?.allMainCourses?.edges}
      apiAdmins={dataAdmins?.allCustomUsers?.edges}
      apiLects={dataLects?.allCustomUsers?.edges}
    />

  )
}

export default page;

export const metadata: Metadata = {
  title:
    "Course Assignment",
};

// export async function generateStaticParams() {
//   const domain = "test";
//   const res = await queryServerGraphQL({
//     domain,
//     query: GET_DATA_SCHOOLS,
//   });

//   if (res) {
//     const schoolIds = res?.allSchoolInfos?.edges?.map((e: EdgeSchoolHigherInfo) => decodeUrlID(e.node.id)) || [];
//     return schoolIds.map((id: string) => ({
//       domain,
//       school_id: id.toString(),
//     }))
//   }

//   return [ { domain, school_id: 1 } ];
// }




// const GET_DATA_SCHOOLS = gql`
//   query {
//     allSchoolInfos {
//       edges {
//         node {
//           id
//         }
//       }
//     }
//   }
// `;


const GET_DATA_MAINCOURSES = gql`
 query GetAllData (
  $courseName: String
 ) {
  allMainCourses (
    courseName: $courseName
  ) {
    edges {
      node {
        id courseName
      }
    }
  }
}
`;

const GET_DATA_CUSTOMUSER = gql`
 query GetAllData(
  $schoolId: Decimal!,
  $role: String!,
) {
  allCustomUsers(
    schoolId: $schoolId
    role: $role,
    isActive: true,
    isStaff: false
  ) {
    edges {
      node {
        id fullName username sex dob pob address telephone email lastLogin
      }
    }
  }
}
`;
