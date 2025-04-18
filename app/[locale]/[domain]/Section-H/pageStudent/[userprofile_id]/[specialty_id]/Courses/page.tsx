import { Metadata } from 'next';
import React, { Suspense } from 'react'
import NotificationError from '@/section-h/common/NotificationError';
import { gql } from '@apollo/client';
import getApolloClient from '@/functions';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';
import List from './List';


export const metadata: Metadata = {
    title: "My Courses",
    description: "My Courses Page",
};

const page = async ({
    params,
    searchParams
}: {
    params: { locale: string, userprofile_id: string, domain: string, specialty_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const Columns: TableColumn<EdgeCourse>[] = [
        { header: "#", align: "center", render: (_item: EdgeCourse, index: number) => index + 1, },
        { header: "Course Name", accessor: "node.mainCourse.courseName", align: "left" },
    ]

    const client = getApolloClient(params.domain);
    let data;
    try {
        const result = await client.query<any>({
            query: GET_DATA,
            variables: {
                specialtyId: params.specialty_id,
                timestamp: new Date().getTime()
            },
            fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
        console.log(error, 35)
    }

    return (
        <div>
            {searchParams && <NotificationError errorMessage={searchParams} />}

            <div className='h-screen mx-1 my-16 p-1 rounded text-black'>

                <div className='flex font-semibold items-center justify-center mb-2 text-xl'>MY COURSES</div>

                <Suspense fallback={<div>Loading ...</div>}>

                    <List params={params} data={data} searchParams={searchParams} />

                </Suspense>

            </div>

        </div>
    )
}

export default page



const GET_DATA = gql`
 query GetData(
   $specialtyId: Decimal!
  ) {
    allCourses(
      specialtyId: $specialtyId
    ){
      edges {
        node {
          id 
          courseCode
          courseCredit
          courseType
          semester
          hours
          hoursLeft
          assignedTo { id fullName }
          mainCourse {
            id
            courseName
          }
          specialty {
            id
            academicYear
            level {
              level
            }
            mainSpecialty {
              specialtyName
            }
            registration tuition paymentOne paymentTwo paymentThree
            school { campus}
          }
        }
      }
    }
  }
`;

