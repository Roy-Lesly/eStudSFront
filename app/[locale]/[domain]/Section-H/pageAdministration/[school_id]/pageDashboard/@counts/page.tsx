import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import Display from './Display';
import { getAcademicYear } from '@/utils/functions';

const page = async (
  { params }:
    { params: any }
) => {

  const { domain, school_id } = await params;

  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
    variables: {
      academicYear: getAcademicYear(),
      schoolId: parseInt(school_id)
    },
  });

  return (<Display
    data={data?.getStatsUserCount}
  />
  );
};

export default page;


const GET_DATA = gql`
 query GetData(
  $schoolId: ID!,
  $academicYear: String!,
) {
    getStatsUserCount(
      schoolId: $schoolId,
      academicYear: $academicYear,
      schoolType: "H"
    ) {
        staffs { active inactive }
        teachers { active inactive }
        students { active inactive }
      }
  }`;
