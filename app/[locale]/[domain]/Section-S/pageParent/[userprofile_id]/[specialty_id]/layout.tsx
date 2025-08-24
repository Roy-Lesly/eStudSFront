import { EdgeSchoolFees, EdgeUserProfile } from "@/Domain/schemas/interfaceGraphql";
import { decodeUrlID } from "@/functions";
import Footer from "@/section-h/compStudent/components/Footer";
import Navbar from "@/section-h/compStudent/components/Navbar";
import getApolloClient from "@/utils/graphql/GetAppolloClient";
import { queryServerGraphQL } from "@/utils/graphql/queryServerGraphQL";
import { gql } from "@apollo/client";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Student Page",
  description: "Student Home Page",
};


const GET_DATA = gql`
 query GetAllData(
    $userprofileId: Decimal!,
  ) {
    allSchoolFees(
      userprofileId: $userprofileId
    ) {
      edges {
        node {
          id
          balance
          platformPaid
          userprofile {
            id session
            customuser { 
              id matricle firstName lastName fullName
            }
            specialty { 
              id
              academicYear
              mainSpecialty { specialtyName }
              level { level }
              tuition
              school {
                schoolName region campus
              }
            }
          }
        }
      }
    }
  }
`;



const page = async ({
  params,
  children
}: {
  params: any;
  children: React.ReactNode;

}) => {

  const p = await params;

   const data = await queryServerGraphQL({
     domain: p?.domain,
     query: GET_DATA,
     variables: {
       userprofileId: parseInt(p.userprofile_id),
     },
   });

  console.log(110, data);


  return (
    <div className="w-full">
      {data && <Navbar feeInfo={data?.allSchoolFees.edges[0]} />}
      {children}
      {data && <Footer params={p} feeInfo={data?.allSchoolFees.edges[0]} />}
    </div>
  );
}

export default page;