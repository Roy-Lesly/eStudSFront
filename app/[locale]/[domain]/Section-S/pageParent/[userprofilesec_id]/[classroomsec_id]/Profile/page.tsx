import React from "react";
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';
import { Metadata } from "next";
import { gql } from "@apollo/client";
import List from "./List";

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

  const client = getApolloClient(p.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        id: parseInt(p.userprofile_id),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error);
    if (error.networkError && error.networkError.result) {
    }
    data = null;
  }


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