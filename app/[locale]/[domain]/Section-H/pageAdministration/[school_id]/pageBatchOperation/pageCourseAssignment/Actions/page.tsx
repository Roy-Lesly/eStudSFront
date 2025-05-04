import { Metadata } from 'next'
import React from 'react'
import CourseAssignAction from './CourseAssignAction'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import getApolloClient, { getData } from '@/functions'
import NotificationError from '@/section-h/common/NotificationError'
import { GetMainCourseUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { GetCustomUserUrl } from '@/Domain/Utils-H/userControl/userConfig'
import { protocol } from '@/config'
import { gql } from '@apollo/client'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetMainCourseUrl, { nopage: true }, params.domain);

  const client = getApolloClient(params.domain);
    let dataAdmins;
    let dataLects;
  
    try {
      const result = await client.query<any>({
        query: GET_DATA_ADMIN,
        variables: {
          schoolId: parseInt(params.school_id),
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      dataAdmins = result.data;
    } catch (error: any) {
      
      dataAdmins = null;
    }
    
    try {
      const result = await client.query<any>({
        query: GET_DATA_LECTURERS,
        variables: {
          schoolId: parseInt(params.school_id),
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      dataLects = result.data;
    } catch (error: any) {
      console.log(error, 81)
      
      dataLects = null;
    }

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName={`Set Course Properties`}
          pageName1="Dashboard"
          link1={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageCourseAssignment`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <CourseAssignAction apiData={apiData} searchParams={searchParams} apiAdmin={dataAdmins?.allCustomUsers?.edges} apiLecturer={dataLects?.allCustomUsers?.edges} />}

      </>
    </LayoutAdmin>
  )
}

export default page;

export const metadata: Metadata = {
  title:
    "Course Assignment",
};



const GET_DATA_LECTURERS = gql`
 query GetAllData(
  $schoolId: Decimal!,
) {
  allCustomUsers(
    schoolId: $schoolId
    role: "teacher",
    isActive: true,
    isStaff: false
  ) {
    edges {
      node {
        id fullName username sex dob pob address telephone email lastLogin
      }
    }
  }
}
`;

const GET_DATA_ADMIN = gql`
 query GetAllData(
  $schoolId: Decimal!,
) {
  allCustomUsers(
    schoolId: $schoolId
    role: "admin"
    isActive: true,
    isStaff: false
  ) {
    edges {
      node {
        id fullName username sex dob pob address telephone email lastLogin
      }
    }
  }
}
`;
