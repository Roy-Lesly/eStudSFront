import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import { getAcademicYear } from '@/utils/functions';
import DashboardCount from '@/app/[locale]/[domain]/SectionAll/Dashboard/DashboardCount';


const page = async (
  { params }:
    { params: any }
) => {

  const p = await params;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      academicYear: getAcademicYear(),
      schoolId: parseInt(p.school_id),
    },
  });

  console.log(data);

  return (
    <DashboardCount
      p={p}
      data={data?.allStatistics?.edges[0]}
    />
  );
};

export default page;


const GET_DATA = gql`
 query GetData(
  $schoolId: Decimal!,
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
}`;

