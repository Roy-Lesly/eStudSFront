import initTranslations from "@/initTranslations";
import { gql } from "@apollo/client";
import { queryServerGraphQL } from "@/utils/graphql/queryServerGraphQL";
import DisplayParentStudent from "@/app/[locale]/[domain]/SectionAll/ParentStudent/DisplayParentStudent";


const page = async (
  { params }
    :
    {
      params: any;
      searchParams: any;
    }) => {

  const p = await params;

  const { t } = await initTranslations(p.locale, ['common']);

  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_PROFILE,
    variables: {
      id: p?.userprofile_id
    },
  });

  return (
    <main className="mb-20 mt-[70px]">
      <DisplayParentStudent
        profile={data?.allUserProfiles?.edges[0]?.node}
        section="H"
        role="parent"
        p={p}
      />
    </main>
  );
}

export default page;




const GET_PROFILE = gql`
 query GetAllData (
  $id: ID!
 ) {
  allUserProfiles (
    id: $id
  ) {
    edges {
      node {
        id
        customuser { id matricle fullName photo }
        specialty { 
          id academicYear 
          level { level }
          mainSpecialty { specialtyName }
        }
      }
    }
  }
}
`;