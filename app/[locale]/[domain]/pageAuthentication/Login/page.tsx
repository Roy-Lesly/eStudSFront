import { gql } from '@apollo/client';
import React from 'react';
import Display from './Display';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const page = async (
  { params }
    :
    {
      params: any;
      searchParams?: any;
    }
) => {

  const { domain, locale } = await params;

  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
  });

  return <Display schools={data?.allSchoolInfos?.edges} params={{ domain, locale }} />;
}

export default page;


const GET_DATA = gql`
  query GetAllData {
    allSchoolInfos {
      edges {
        node {
          id
          campus
          town
          schoolIdentification { name logo hasSecondary hasPrimary hasVocational }
        }
      }
    }
  }
`;