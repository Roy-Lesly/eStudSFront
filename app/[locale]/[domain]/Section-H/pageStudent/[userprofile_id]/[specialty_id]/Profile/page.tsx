import React from "react";
import getApolloClient from "@/functions";
import { Metadata } from "next";
import { gql } from "@apollo/client";
import List from "./List";

export const metadata: Metadata = {
  title: "My Profile",
  description: "This is the Profile Page",
};

const page = async ({
  params,
}: {
  params: { specialty_id: string; userprofile_id: string; domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        id: parseInt(params.userprofile_id),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error)
    if (error.networkError && error.networkError.result) {
    }
    data = null;
  }


  return (
    <List
      data={data}
      params={params}
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
            user { id fullName matricle photo dob pob telephone address parent parentTelephone nationality highestCertificate yearObtained regionOfOrigin} 
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