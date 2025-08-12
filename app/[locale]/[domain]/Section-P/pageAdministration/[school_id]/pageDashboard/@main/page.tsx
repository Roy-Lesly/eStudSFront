import GenderGraph from './GenderGraph';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import { getAcademicYear } from '@/utils/functions';
import YearlyStudentGraph from './YearlyStudentGraph';


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

    <div className="flex flex-col md:flex-row gap-4">

      <GenderGraph
        title="Staff"
        genderData={data?.getStatsGenderChart?.staff}
      />

      <GenderGraph
        title="Students"
        genderData={data?.getStatsGenderChart?.students}
      />

      <YearlyStudentGraph
        data={data?.getStatsGenderChart?.yearlyStudentCount}
      />

    </div>

  );
};

export default page;



const GET_DATA = gql`
 query GetData(
  $schoolId: ID!,
  $academicYear: String!,
) {
    getStatsGenderChart (
      schoolId: $schoolId,
      academicYear: $academicYear,
      schoolType: "P"
    ) {
        yearlyStudentCount { 
          academicYear
          active
          inactive
        }
        staff {
          name
          count
        }
        students {
          name
          count
        }
      }
  }`;
