import React from 'react'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import PreFormHigher from '../SectionHigher/PreFormHigher';
import PreFormSecondary from '../SectionSecondary/PreFormSecondary';
import PreFormVocational from '../SectionVocational/PreFormVocational';
import PreFormPrimary from '../SectionPrimary/PreFormPrimary';

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) => {

  const { domain, section } = await params;
  const p = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain,
    query: section === "higher" ? GET_DATA_HIGHER : section === "secondary" ? GET_DATA_SECONDARY : section === "primary" ? GET_DATA_PRIMARY : GET_DATA_VOCATIONAL,
    variables: {
      schoolType: "-" + section[0],
    },
  });

  console.log(data);

  return (
    <>
      <div className="flex flex-col gap-4 h-screen md:p-4 p-2 text-slate-900">

        <div className='flex flex-col gap-2 w-full'>
          {section === "higher" ? <PreFormHigher source='student' data={data} params={p} /> : null}
          {section === "secondary" ? <PreFormSecondary params={{ domain, section }} source='student' data={data} /> : null}
          {section === "primary" ? <PreFormPrimary params={{ domain, section }} source='student' data={data} /> : null}
          {section === "vocational" ? <PreFormVocational source='student' data={data} /> : null}
        </div>
      </div>

    </>
  )
}

export default page


export const metadata: Metadata = {
  title: "New Pre-Inscription Page",
  description: "New Pre-Inscription Page",
};


const GET_DATA_HIGHER = gql`
 query GetAllData (
  $schoolType: String!
 ) {
  allAcademicYears
  allSchoolInfos (
    schoolType: $schoolType
  ) {
    edges {
      node {
        id campus town address schoolIdentification { name }
      }
    }
  }
  allPrograms(
    last: 50
  ) {
    edges {
      node {
        id name
      }
    }
  }
  allLevels(
    last: 10
  ) {
    edges {
      node {
        id level
      }
    }
  }
  allMainSpecialties(
    last: 100
  ) {
    edges {
      node {
        id specialtyName
      }
    }
  }
}
`;



const GET_DATA_SECONDARY = gql`
 query GetAllData (
  $schoolType: String!
 ) {
  allAcademicYears
  getProgramsSec
  getLevelsSec

  allSchoolInfos (
    schoolType: $schoolType
  ) {
    edges {
      node {
        id campus town address schoolIdentification { name }
      }
    }
  }
  allClassroomsSec(
    last: 50
  ) {
    edges {
      node {
        id level academicYear select
      }
    }
  }
  allSeries(
    last: 100
  ) {
    edges {
      node {
        id name level
      }
    }
  }
}
`;



const GET_DATA_PRIMARY = gql`
 query GetAllData (
  $schoolType: String!
 ) {
  allAcademicYears

  allSchoolInfos (
    schoolType: $schoolType
  ) {
    edges {
      node {
        id campus town address schoolIdentification { name }
      }
    }
  }
  getProgramsPrim
  getLevelsPrim
}
`;



const GET_DATA_VOCATIONAL = gql`
 query GetAllData (
  $schoolType: String!
 ) {
  allAcademicYears

  allSchoolInfos (
    schoolType: $schoolType
  ) {
    edges {
      node {
        id campus town address schoolIdentification { name }
      }
    }
  }
  allPrograms(
    last: 50
  ) {
    edges {
      node {
        id name
      }
    }
  }
  allLevels(
    last: 10
  ) {
    edges {
      node {
        id level
      }
    }
  }
  allMainSpecialties(
    last: 100
  ) {
    edges {
      node {
        id specialtyName
      }
    }
  }
}
`;
