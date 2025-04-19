import NotificationError from '@/section-h/common/NotificationError';
import getApolloClient, { getData } from '@/functions';
import React, { FC } from 'react'
import { TransactionUrl } from '@/Domain/Utils-H/feesControl/feesConfig';
import { protocol } from '@/config';
import { redirect } from 'next/navigation';
import { SchemaTransactionCreate } from '@/Domain/schemas/schemas';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { collectMoney } from '@/payment';
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

    if (error.networkError && error.networkError.result) {
      console.error('GraphQL Error Details:', error.networkError.result.errors);
    }
    console.log(error, 103)
    data = null;
  }

  return (
    <div className='mt-16 px-2'>
      {searchParams && <NotificationError errorMessage={searchParams} />}
      {data && data.allSchoolFees.edges.length == 1 ? <List apiSchoolFees={data.allSchoolFees.edges[0]} apiTransactions={data.allTransactions.edges}  params={params} />
      :
      <>No School Fees</>
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

  const { t } = await initTranslations(params.locale, ['common'])
  const onActivate = async (formData: FormData) => {
    "use server"

    var payer = formData.get("telephone");
    var operator = formData.get("operator");
    var url = formData.get("url");
    var origin = formData.get("origin");

    const data = {
      schoolfees_id: apiSchoolFees.node.id,
      telephone: payer,
      operator: operator,
      payment_method: operator,
      amount: apiSchoolFees.node.userprofile.specialty.school.schoolIdentification.platformCharges,
      reason: "Platform Charges",
      account: "PLATFORM CHARGES",
      status: "completed",
      operation_type: "other",
      origin: origin,
    }

    var pay: any = await collectMoney({ amount: data.amount, service: data.operator, payer: payer });

    if (!pay.operation && pay.transaction == "could-not-perform-transaction") {
      redirect(`${url}?customerror=Transaction Cancelled by User`)
    }
    if (!pay.operation && pay.transaction == "low-balance-payer") {
      redirect(`${url}?customerror=Not Enough Funds`)
    }
    if (!pay.operation && pay.transaction == "ENOTFOUND") {
      redirect(`${url}?error=Transaction Error`)
    }
    if (!pay.operation && !pay.transaction) {
      redirect(`${url}?error=Transaction Error`)
    }

    if (pay.operation) {
      const response = await ActionCreate(data, SchemaTransactionCreate, protocol + "api" + params.domain + TransactionUrl)
      console.log(response, 80)

      if (response.error) {
        redirect(`${url}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
      }
      if (response?.errors) {
        redirect(`${url}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
      }
      if (response?.detail) {
        redirect(`${url}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
      }
      if (response?.id) {
        redirect(`${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees?success=Successfully Activated-${JSON.stringify(response.schoolfees.userprofile.user.full_name).replaceAll(" ", "-")}`)
      }
    } else {
      //   redirect(`${url}/${params.schoolfees_id}?error=Transaction Failed`)
    }
  }


  return (
    <DisplayFees apiSchoolFees={apiSchoolFees} apiTransactions={apiTransactions} params={params}/>
  );

}