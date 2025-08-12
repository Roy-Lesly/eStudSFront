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

  const dataHigher = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_HIGHER,
    variables: {
        parentTelephone: sp?.tel
    },
  });

  const dataSecondary = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_SECONDARY,
    variables: {
        parentTelephone: sp?.tel
    },
  });

  const dataPrimary = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_PRIMARY,
    variables: {
        parentTelephone: sp?.tel
    },
  });

  return (
    <Display
      p={p}
      dataH={dataHigher?.allSchoolFees?.edges}
      dataS={dataSecondary?.allSchoolFees?.edges}
      dataP={dataPrimary?.allSchoolFees?.edges}
    />
  )
}

export default page


const GET_DATA_HIGHER = gql`
 query GetAllData (
  $parentTelephone: String!
 ) {
  allSchoolFees (
    parentTelephone: $parentTelephone
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

const GET_DATA_SECONDARY = gql`
 query GetAllData (
  $parentTelephone: String!
 ) {
  allSchoolFeesSec (
    parentTelephone: $parentTelephone
  ) {
    edges {
      node {
        id platformPaid
        userprofilesec { 
          id 
          classroomsec { 
            id academicYear 
            level
            cycle
          }
          programsec
        }
      }
    }
  }
}
`;

const GET_DATA_PRIMARY = gql`
 query GetAllData (
  $parentTelephone: String!
 ) {
  allSchoolFeesPrim (
    parentTelephone: $parentTelephone
  ) {
    edges {
      node {
        id platformPaid
        userprofileprim { 
          id 
          classroomprim { 
            id academicYear 
            level
            cycle
          }
          programprim
        }
      }
    }
  }
}
`;