import NotificationError from '@/section-h/common/NotificationError';
import getApolloClient from '@/functions';
import React, { FC } from 'react';
import DisplayFees from './DisplayFees';
import { gql } from '@apollo/client';
import { EdgeSchoolFees, EdgeTransactions } from '@/Domain/schemas/interfaceGraphql';
import initTranslations from '@/initTranslations';


interface SchooFeesAndTransactionsResponse {
  allSchoolFees: {
    edges: EdgeSchoolFees[]
  }
  allTransactions: {
    edges: EdgeTransactions[]
  }
}

const GET_DATA = gql`
 query GetAllData(
    $first: Int,
    $userprofileId: Decimal,
  ) {
    allSchoolFees(first: $first, userprofileId: $userprofileId) {
      edges {
        node {
          id
          balance
          platformPaid
          userprofile {
            id info
            session
            user { 
              id matricle firstName lastName fullName
            }
            specialty { 
              id
              academicYear
              mainSpecialty { specialtyName }
              level { level }
              tuition
              paymentOne
              paymentTwo
              paymentThree
              school { 
                schoolfeesControl
                schoolIdentification { platformCharges }
                caLimit examLimit resitLimit
              }
            }
            program { id name }
          }
        }
      }
    }
    allTransactions(first: 40, userprofileId: $userprofileId) {
      edges {
        node {
          id amount reason createdAt createdBy { fullName }
        }
      }
    }
  }`;
  
const page = async ({
  params,
  searchParams,
}: {
  params: { locale: string, userprofile_id: string, domain: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const { t } = await initTranslations(params.locale, ["common"])
  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<SchooFeesAndTransactionsResponse>({
      query: GET_DATA,
      variables: {
        first: 40,
        userprofileId: params.userprofile_id,
      },
    });
    data = result.data;
  } catch (error: any) {

    
    console.log(error, 103)
    data = null;
  }

  return (
    <div className='mt-16 px-2'>
      {searchParams && <NotificationError errorMessage={searchParams} />}
      {data && data.allSchoolFees.edges.length == 1 ? <List apiSchoolFees={data.allSchoolFees.edges[0]} apiTransactions={data.allTransactions.edges}  params={params} />
      :
      <>{t("No School Fees")}</>
      }
    </div>
  )
}

export default page



interface Props {
  apiSchoolFees: EdgeSchoolFees
  apiTransactions: EdgeTransactions[]
  params: any
}
const List: FC<Props> = async ({ apiSchoolFees, apiTransactions, params }) => {

  return (
    <DisplayFees apiSchoolFees={apiSchoolFees} apiTransactions={apiTransactions} params={params}/>
  );

}