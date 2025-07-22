import NotificationError from '@/section-h/common/NotificationError';
import React, { FC } from 'react';
import DisplayFees from './DisplayFees';
import { gql } from '@apollo/client';
import { EdgeSchoolFees, EdgeTransactions } from '@/Domain/schemas/interfaceGraphql';
import initTranslations from '@/initTranslations';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params
  const sp = await searchParams

  const { t } = await initTranslations(p.locale, ["common"])

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      first: 40,
      userprofileId: p.userprofile_id,
    },
  });

  return (
    <div className='mt-16 px-2'>
      {sp && <NotificationError errorMessage={sp} />}
      {data && data.allSchoolFees.edges.length == 1 ? <List apiSchoolFees={data.allSchoolFees.edges[0]} apiTransactions={data.allTransactions.edges} params={p} />
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
    <DisplayFees apiSchoolFees={apiSchoolFees} apiTransactions={apiTransactions} params={params} />
  );

}



const GET_DATA = gql`
 query GetAllData(
    $first: Int,
    $userprofileId: Decimal,
  ) {
    allSchoolFees(
      first: $first,
      userprofileId: $userprofileId
    ) {
      edges {
        node {
          id
          balance
          platformPaid
          idPaid
          userprofile {
            id infoData
            session
            customuser { 
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
                schoolIdentification { platformCharges idCharges }
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
