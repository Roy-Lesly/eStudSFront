import { EdgeSchoolFees, EdgeUserProfile } from "@/Domain/schemas/interfaceGraphql";
import getApolloClient, { decodeUrlID } from "@/functions";
import Footer from "@/section-h/compStudent/components/Footer";
import Navbar from "@/section-h/compStudent/components/Navbar";
import { gql } from "@apollo/client";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Student Page",
  description: "Student Home Page",
};


interface UserProfileAndSchooFeesAndSchoolInfoResponse {
  allUserProfiles: {
    edges: EdgeUserProfile[];
  };
  allSchoolFees: {
    edges: EdgeSchoolFees[]
  }
}

const GET_DATA = gql`
 query GetAllData(
    $first: Int,
    $userprofileIdA: ID,
    $userprofileIdB: Decimal,
  ) {
    allUserProfiles(first: $first, id: $userprofileIdA) {
      edges {
        node {
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
            school {
              schoolName region campus
            }
          }
        }
      }
    }
    allSchoolFees(first: $first, userprofileId: $userprofileIdB) {
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
            }
            program { id name }
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

  const client = getApolloClient(p.domain);
  let data;
  try {
    const result = await client.query<UserProfileAndSchooFeesAndSchoolInfoResponse>({
      query: GET_DATA,
      variables: {
        first: 1,
        userprofileIdA: decodeUrlID(p.userprofile_id),
        userprofileIdB: decodeUrlID(p.userprofile_id),
      },
    });
    data = result.data;
  } catch (error: any) {

    
    data = null;
  }


  return (
    <div className="w-full">
      {data && <Navbar profileInfo={data?.allUserProfiles.edges[0]} feeInfo={data?.allSchoolFees.edges[0]} />}
      {children}
      {data && <Footer params={p} profileInfo={data?.allUserProfiles.edges[0]} feeInfo={data?.allSchoolFees.edges[0]} />}
    </div>
  );
}

export default page;