import React from 'react';
import { gql } from '@apollo/client';
import PreInsNavBar from './PreInsNavBar';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const layout = async ({
  params,
  children,
}: {
  params: any;
  children: React.ReactNode;
}) => {
  const { domain } = await params;

  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
  });

  return (
    <div className="flex flex-col gap-2 md:gap-4 h-screen md:p-4 p-2 text-slate-900">
      <PreInsNavBar params={{ domain }} page={1} info={data?.allSchoolIdentifications?.edges[0]} />
      {children}
    </div>
  );
};

export default layout;

const GET_DATA = gql`
  query GetAllData {
    allSchoolIdentifications {
      edges {
        node {
          name logo
        }
      }
    }
  }
`;
