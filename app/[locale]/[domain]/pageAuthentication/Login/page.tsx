import { Metadata } from "next";
import LoginForm from "./LoginForm";
import { gql } from "@apollo/client";
import getApolloClient from "@/utils/graphql/GetAppolloClient";


const GET_DATA = gql`
  query GetAllData {
    allSchoolInfos {
      edges {
        node {
          id
          campus
          town
        }
      }
    }
  }
`;

const Home = async ({
  params,
}: {
    params: any;
    searchParams?: any;
}) => {
  const p = await params;

  const client = getApolloClient(p.domain);
  let data = null;

  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        timestamp: new Date().getTime(),
      },
      fetchPolicy: "no-cache",
    });
    data = result.data;
  } catch (error: any) {
    console.error(error);
  }

  return <LoginForm schools={data?.allSchoolInfos?.edges} params={p} />;
};

export default Home;

export const metadata: Metadata = {
  title: "Login",
  description: "This is the Login page",
};
