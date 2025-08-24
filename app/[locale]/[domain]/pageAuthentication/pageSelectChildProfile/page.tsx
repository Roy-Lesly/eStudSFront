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

  const dataCustomuser = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_CUSTOMUSER,
    variables: {
        parentTelephone: sp?.tel
    },
  });

  const dataYears=[ ...new Set([ ...dataHigher?.allAcademicYears, ...dataSecondary?.allAcademicYearsSec, ...dataPrimary?.allAcademicYearsPrim ]) ]


  return (
    <Display
      p={p}
      dataUsers={dataCustomuser?.allCustomusers?.edges}
      dataH={dataHigher?.allSchoolFees?.edges}
      dataS={dataSecondary?.allSchoolFeesSec?.edges}
      dataP={dataPrimary?.allSchoolFeesPrim?.edges}
      dataYears={dataYears?.sort((a: string, b: string) => parseInt(b.split("/")[0], 10) - parseInt(a.split("/")[0], 10))}
    />
  )
}

export default page


const GET_DATA_CUSTOMUSER = gql`
 query GetAllData (
  $parentTelephone: String!
 ) {
  allCustomusers (
    parentTelephone: $parentTelephone
  ) {
    edges {
      node {
        id fullName
      }
    }
  }
}
`;


const GET_DATA_HIGHER = gql`
 query GetAllData (
  $parentTelephone: String!
 ) {
  allAcademicYears
  allSchoolFees (
    parentTelephone: $parentTelephone
  ) {
    edges {
      node {
        id platformPaid
        userprofile { 
          id
          specialty { 
            id academicYear 
            level { level} 
            mainSpecialty { specialtyName}
          }
          customuser { id fullName }
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
  allAcademicYearsSec
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
          customuser { id fullName }
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
  allAcademicYearsPrim
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
          customuser { id fullName }
          programprim
        }
      }
    }
  }
}
`;