import { Metadata } from 'next';
import { gql } from '@apollo/client';
import HomePageContent from './HomeComps/HomePageContent';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';


const Home = async (
  { params }: { params: any }
) => {

  const p = await params;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_INFO,
  });

  return <HomePageContent
    params={p}
    network={data === null}
    data={data?.allSchoolIdentifications?.edges[0]}
  />;
};

export default Home;

export const metadata: Metadata = {
  title: 'School System',
  description: 'Manage your school smarter with E-conneq — a Multilingual, Multi-campus system covering everything from student admission to results and fee tracking.'
};


const GET_INFO = gql`
  query GetInfo {
    allSchoolIdentifications (
      first: 1
    ) {
      edges {
        node {
          id name version messageOne messageTwo logo supportNumberOne
          hasHigher hasSecondary hasPrimary hasVocational
        }
      }
    }
  }
`;

