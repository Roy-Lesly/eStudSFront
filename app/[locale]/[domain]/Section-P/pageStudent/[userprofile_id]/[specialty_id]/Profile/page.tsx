import React from "react";
import { Metadata } from "next";
import { gql } from "@apollo/client";
import List from "./List";
import { queryServerGraphQL } from "@/utils/graphql/queryServerGraphQL";

export const metadata: Metadata = {
  title: "My Profile",
  description: "This is the Profile Page",
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
        id: parseInt(p.userprofile_id),
    },
  });

  return (
    <List
      data={data}
      params={p}
    />
  );
};

export default page;




const GET_DATA = gql`
 query GetData(
    $id: ID!
) {
    allUserProfiles(
        id: $id,
        isActive: true
    ){
        edges {
        node {
            id 
            customuser { id fullName matricle photo dob pob telephone address parent parentTelephone nationality highestCertificate yearObtained regionOfOrigin} 
            specialty { 
              academicYear level { level} 
              mainSpecialty { specialtyName}
              school { id campus schoolName
                schoolIdentification { logo} 
              }
            }
        }
    }
  }
}
`;