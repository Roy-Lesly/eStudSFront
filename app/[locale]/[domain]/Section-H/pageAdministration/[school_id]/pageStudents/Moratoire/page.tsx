import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const paginationParams: Record<string, any> = {};

  const date = new Date().getFullYear()

  paginationParams.fullName = searchParams?.fullName
  paginationParams.academicYear = searchParams?.academicYear
  paginationParams.specialtyName = searchParams?.specialtyName
  paginationParams.level = searchParams?.level
  paginationParams.schoolId = parseInt(params.school_id)
  // paginationParams.level = parseInt(searchParams?.level ? Array.isArray(searchParams.level) ? searchParams.level[0] : searchParams.level : "")

  const client = getApolloClient(params.domain);
  let dataPending;
  let dataApproved;
  let dataRejected;
  try {
    console.log(removeEmptyFields(paginationParams))
    const resultP = await client.query<any>({
      query: GET_DATA_PENDING,
      variables: {
        ...removeEmptyFields(paginationParams),
        status: "pending",
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    const resultA = await client.query<any>({
      query: GET_DATA_APPROVED,
      variables: {
        ...removeEmptyFields(paginationParams),
        status: "approved",
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    const resultR = await client.query<any>({
      query: GET_DATA_REJECTED,
      variables: {
        ...removeEmptyFields(paginationParams),
        status: "rejected",
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataPending = resultP.data;
    dataApproved = resultA.data;
    dataRejected = resultR.data;
  } catch (error: any) {
    console.log(error)
    dataPending = null;
    dataApproved = null;
    dataRejected = null;
  }

  console.log(dataPending, "Moratoire => View")

  return (
    <div>
      <List
        params={params}
        dataPending={dataPending}
        dataApproved={dataApproved}
        dataRejected={dataRejected}
        sp={searchParams}
      />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Moratorium",
  description: "This is Moratorium Page",
};




const GET_DATA_PENDING = gql`
 query GetData(
  $fullName: String,
  $academicYear: String,
  $specialtyName: String,
  $schoolId: Decimal!
  $level: Decimal
  $status: String!
) {
  allMoratoires(
    last: 150,
    fullName: $fullName,
    academicYear: $academicYear,
    specialtyName: $specialtyName,   
    schoolId: $schoolId,   
    level: $level,
    status: $status,
  ) {
    edges {
      node {
        id
        reason
        comment
        requestedSchedule { amount dueDate }
        approvedSchedule { amount dueDate }
        userprofile {
          id
          user {
            id fullName, matricle
          }
          specialty { 
            academicYear, 
            level { level }
            mainSpecialty { specialtyName } 
          }
          info
        }
      }
    }
  }
}
`;


const GET_DATA_APPROVED = gql`
 query GetData(
  $fullName: String,
  $academicYear: String,
  $specialtyName: String,
  $schoolId: Decimal!
  $level: Decimal
  $status: String!
) {
  allMoratoires(
    last: 150,
    fullName: $fullName,
    academicYear: $academicYear,
    specialtyName: $specialtyName,   
    schoolId: $schoolId,   
    level: $level,
    status: $status,
  ) {
    edges {
      node {
        id
        reason
        comment
        requestedSchedule {
          amount dueDate
        }
        approvedSchedule { amount dueDate}
        userprofile {
          id
          user {
            id fullName, matricle
          }
          specialty { 
            academicYear, 
            level { level }
            mainSpecialty { specialtyName } 
          }
          info
        }
      }
    }
  }
}
`;


const GET_DATA_REJECTED = gql`
 query GetData(
  $fullName: String,
  $academicYear: String,
  $specialtyName: String,
  $schoolId: Decimal!
  $level: Decimal
  $status: String!
) {
  allMoratoires(
    last: 150,
    fullName: $fullName,
    academicYear: $academicYear,
    specialtyName: $specialtyName,   
    schoolId: $schoolId,   
    level: $level,
    status: $status,
  ) {
    edges {
      node {
        id
        reason
        comment
        requestedSchedule {
          amount dueDate
        }
        approvedSchedule { amount dueDate}
        userprofile {
          id
          user {
            id fullName, matricle
          }
          specialty { 
            academicYear, 
            level { level }
            mainSpecialty { specialtyName } 
          }
          info
        }
      }
    }
  }
}
`;
