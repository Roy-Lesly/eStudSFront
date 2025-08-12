import { Metadata } from 'next'
import React from 'react'
import { removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient'
import List from './List'


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const paginationParams: Record<string, any> = {};

  paginationParams.fullName = sp?.fullName
  paginationParams.academicYear = sp?.academicYear
  paginationParams.specialtyName = sp?.specialtyName
  paginationParams.level = sp?.level
  paginationParams.schoolId = parseInt(p.school_id)

  const client = getApolloClient(p.domain);
  let dataPending;
  let dataApproved;
  let dataRejected;
  try {
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
    errorLog(error);
    dataPending = null;
    dataApproved = null;
    dataRejected = null;
  }

  return (
    <div>
      <List
        params={p}
        dataPending={dataPending}
        dataApproved={dataApproved}
        dataRejected={dataRejected}
        sp={sp}
      />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Moratorium",
  description: "e-conneq School System. Moratorium Page",
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
          customuser {
            id fullName, matricle
          }
          specialty { 
            academicYear, 
            level { level }
            mainSpecialty { specialtyName } 
          }
          infoData
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
          customuser {
            id fullName, matricle
          }
          specialty { 
            academicYear, 
            level { level }
            mainSpecialty { specialtyName } 
          }
          infoData
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
          customuser {
            id fullName, matricle
          }
          specialty { 
            academicYear, 
            level { level }
            mainSpecialty { specialtyName } 
          }
          infoData
        }
      }
    }
  }
}
`;
