import Display from './Display';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_PROFILES,
    variables: {
        customuserId: sp?.user

    },
  });

  return (
    <Display
      p={p}
      data={data?.allSchoolFees?.edges}
    />
  )
}

export default page


const GET_PROFILES = gql`
 query GetAllData (
  $customuserId: Decimal!
 ) {
  allSchoolFees (
    customuserId: $customuserId
  ) {
    edges {
      node {
        id platformPaid
        userprofile { 
          id specialty { 
            id academicYear 
            level { level} 
            mainSpecialty { specialtyName}
          }
          program { name }
        }
      }
    }
  }
}
`;