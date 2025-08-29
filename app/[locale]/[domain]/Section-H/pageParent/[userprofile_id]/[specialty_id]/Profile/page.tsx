import React from "react";
import { Metadata } from "next";
import { gql } from "@apollo/client";
import { queryServerGraphQL } from "@/utils/graphql/queryServerGraphQL";
import DisplayProfile from "@/app/[locale]/[domain]/SectionAll/ParentStudent/DisplayProfile";


export const metadata: Metadata = {
  title: "My Profile",
  description: "e-conneq School System. the Profile Page",
};

const page = async ({
  params,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;

  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      id: parseInt(p.userprofile_id),
    },
  });

  return (
    <DisplayProfile
      data={data?.allUserProfiles?.edges[0]?.node}
      params={p}
      section="H"
      role="Parent"
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
      isActive: true,
      last: 1
    ){
        edges {
        node {
            id 
            customuser { id fullName matricle photo dob pob telephone address fatherName fatherTelephone motherName motherTelephone nationality highestCertificate yearObtained regionOfOrigin} 
            specialty { 
              academicYear
              level { level }
              mainSpecialty { specialtyName }
              school { id campus schoolName
                schoolIdentification { logo} 
              }
            }
        }
    }
  }
}
`;