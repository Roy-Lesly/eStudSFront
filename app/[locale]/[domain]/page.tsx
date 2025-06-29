import HomePageContent from './HomePageContent';
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import getApolloClient from '@/utils/graphql/GetAppolloClient';


const Home = async (
  { params }: { params: any }
) => {

  const p = await params;

  const client = getApolloClient(p.domain);
    let data;

    try {
      let q: any = {
        timestamp: new Date().getTime()
      }
      const result = await client.query<any>({
        query: GET_INFO,
        variables: q,
        fetchPolicy: 'no-cache'
      });
      data = result.data;
    } catch (error: any) {
      
      data = null;
    }


  return <HomePageContent 
    params={p}
    data={data?.allSchoolIdentifications?.edges[0]}
  />;
};

export default Home;

export const metadata: Metadata = {
  title: 'Home Page',
  description: 'This is the Home Page',
};


const GET_INFO = gql`
  query GetInfo {
    allSchoolIdentifications (
      last: 2
    ) {
      edges {
        node {
          id name version messageOne messageTwo logo
        }
      }
    }
  }
`;

