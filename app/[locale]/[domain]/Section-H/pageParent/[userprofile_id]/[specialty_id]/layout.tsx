import Footer from "@/app/[locale]/[domain]/SectionAll/Footer";
import Navbar from "@/app/[locale]/[domain]/SectionAll/Navbar";
import { queryServerGraphQL } from "@/utils/graphql/queryServerGraphQL";
import { gql } from "@apollo/client";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Parent Page",
  description: "Parent Home Page",
};



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

  return (
    <div className="w-full">


      {data ?
        <Navbar
          school={data?.allSchoolFees.edges[0]?.node?.userprofile?.specialty?.school}
        />
        :
        null
      }


      {children}


      {data ?
        <Footer
          params={p}
          section="H"
          role="Parent"
        />
        :
        null
      }


    </div>
  );
}

export default page;






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