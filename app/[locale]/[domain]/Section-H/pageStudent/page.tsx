import getApolloClient, { capitalizeFirstLetter, decodeUrlID, errorLog, getData } from '@/functions';
import Display from './Display';
import { gql } from '@apollo/client';


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;


  const client = getApolloClient(p.domain);
  let data;

  try {
    const result = await client.query<any>({
      query: GET_PROFILES,
      variables: {
        customuserId: sp?.user
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error)
    data = null;
  }

  return (
    <Display
      p={p}
      data={data?.allUserProfiles?.edges}
    />
  )
}

export default page


const GET_PROFILES = gql`
 query GetAllData (
  $customuserId: Decimal!
 ) {
  allUserProfiles (
    customuserId: $customuserId
  ) {
    edges {
      node {
        id specialty { id academicYear level { level} mainSpecialty { specialtyName}}
      }
    }
  }
}
`;