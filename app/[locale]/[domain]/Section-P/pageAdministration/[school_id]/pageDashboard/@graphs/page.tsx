import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import { getAcademicYear } from '@/utils/functions';
import Display from './Display';


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


  return (
    <Display
      data={data?.getStatsSpecialtyLevelCount}
    />
  );
};

export default page;


const GET_DATA = gql`
 query GetData(
  $schoolId: ID!,
  $academicYear: String!,
) {
    getStatsSpecialtyLevelCount (
      schoolId: $schoolId,
      academicYear: $academicYear
    ) {
        academicYear specialty l100 l200 l300 l400 l500
      }
  }`;
