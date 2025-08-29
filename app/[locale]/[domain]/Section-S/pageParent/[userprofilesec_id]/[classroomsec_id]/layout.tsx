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
      userprofilesecId: parseInt(p.userprofilesec_id),
    },
  });

  return (
    <div className="w-full">


      {data ?
        <Navbar
          school={data?.allSchoolFeesSec.edges[0]?.node?.userprofilesec?.classroomsec?.school}
        />
        :
        null
      }


      {children}


      {data ?
        <Footer
          params={p}
          section="S"
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
    $userprofilesecId: Decimal!,
  ) {
    allSchoolFeesSec(
      userprofilesecId: $userprofilesecId
    ) {
      edges {
        node {
          id
          balance
          platformPaid
          userprofilesec {
            id session
            customuser { 
              id matricle firstName lastName fullName
            }
            classroomsec { 
              id
              academicYear
              level
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