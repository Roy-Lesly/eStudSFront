import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import { getAcademicYear } from '@/utils/functions';
import GenderGraph from '@/app/[locale]/[domain]/SectionAll/Dashboard/GenderGraph';
import YearlyStudentGraph from '@/app/[locale]/[domain]/SectionAll/Dashboard/YearlyStudentGraph';


const page = async (
  { params, searchParams }:
    { params: any, searchParams: any }
) => {

  const p = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      academicYear: sp?.academicYear ? sp?.academicYear : getAcademicYear(),
      schoolId: parseInt(p.school_id),
      schoolId2: parseInt(p.school_id),
    },
  });

  return (
    <div className="flex flex-col md:flex-row gap-4">

      <GenderGraph
        title="Staff"
        data={data?.allStatistics?.edges[0]?.node?.countUserCampus}
      />

      <GenderGraph
        title="Students"
        data={data?.allStatistics?.edges[0]?.node?.countUserCampus}
      />

      <YearlyStudentGraph
        data={data?.allSchoolInfos?.edges[0]?.node}
      />

    </div>
  );
};

export default page;


const GET_DATA = gql`
 query GetData(
  $schoolId: Decimal!,
  $schoolId2: ID!,
  $academicYear: String!,
) {
   allStatistics (
    academicYear: $academicYear,
    schoolId: $schoolId
  ) {
    edges {
      node {
        academicYear
        school { id campus }
        countUserCampus
        updatedAt
        updatedBy { id fullName }
      }
    }
  }
  allSchoolInfos (
    id: $schoolId2,
  ) {
    edges {
      node {
        infoData
      }
    }
  }
}`;