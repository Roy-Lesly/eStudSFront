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
      id: p?.userprofilesec_id
    },
  });

  return (
    <main className="mb-20 mt-[70px]">
      <DisplayParentStudent
        profile={data?.allUserprofilesSec?.edges[0]?.node}
        section="S"
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
  allUserprofilesSec (
    id: $id
  ) {
    edges {
      node {
        id
        customuser { id matricle fullName photo }
        classroomsec { id academicYear 
          level cycle classType
        }
      }
    }
  }
}
`;