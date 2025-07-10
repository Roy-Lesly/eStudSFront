import { EdgeSpecialty, EdgeTimeTable } from '@/Domain/schemas/interfaceGraphql'
import { decodeUrlID } from '@/functions';
import { gql, useQuery } from '@apollo/client';
import React from 'react'
import TimeTableCard from '../[timetable_id]/TimeTableCard';

const DrawTimeTable = (
    { params, query }
        :
        { params: any, query: { specialty: EdgeSpecialty, year: number, month: number, day: number } }
) => {

    const variables = {
        schoolId: parseInt(params.school_id),
        specialtyId: parseInt(decodeUrlID(query.specialty?.node.id)),
        year: query.year,
        month: query.month,
    }

    const { loading, error, data } = useQuery(GET_TIMETABLES, { variables });

    if (loading) return <div className='flex w-full justify-center items-center'>
        <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-10 rounded-full w-10"></div>
    </div>;
    if (error) return <p>Error: {error.message}</p>;

    const newTimeTable = [
        {
            node: {
                year: query.year,
                month: query.month,
                monthName: new Date(2000, query.month - 1, 1).toLocaleString('en-US', { month: 'long' }),
                published: false,
                specialtyId: parseInt(decodeUrlID(query.specialty.node.id)),
                period: [
                    {
                        date: `${query.year}-${String(query.month).padStart(2, '0')}-${String(query.day).padStart(2, '0')}`,
                        slots: [
                            {
                                assignedToId: 0,
                                assignedToName: "",
                                byId: null,
                                byName: null,
                                courseId: 0,
                                courseName: "",
                                duration: 0,
                                end: "",
                                hall: "",
                                hallUsed: null,
                                hours: 0,
                                loginTime: null,
                                logoutTime: null,
                                remarks: null,
                                session: "",
                                start: "",
                                status: "Pending",
                            },
                        ],
                    },
                ],
            },
        }
    ];

    return (
        <>
            <div className="w-full mx-auto p-2">
                <div className='flex justify-between items-center mb-2 text-black'>
                    <h1 className="text-2xl font-bold text-center">📅 TimeTable Schedule</h1>
                    <h1 className="text-xl font-bold text-center">
                        Class: <code>{query.specialty.node?.mainSpecialty?.specialtyName} - {query.specialty.node?.academicYear} - {query.specialty.node?.level?.level}</code>
                    </h1>
                </div>
                <div className="space-y-2">
                    {(data?.allTimeTables?.edges.length ? data?.allTimeTables?.edges : newTimeTable)?.map((timetable: EdgeTimeTable) => (
                        <TimeTableCard
                            key={timetable.node?.id || timetable.node?.month}
                            timetable={timetable}
                            apiCourses={data?.allCourses?.edges}
                            apiHalls={data?.allHalls?.edges}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default DrawTimeTable


const GET_TIMETABLES = gql`
  query GetTimeTables (
    $schoolId: Decimal!,
    $specialtyId: Decimal!
    $year: Decimal!
    $month: Decimal!
  ) {
    allTimeTables(
      schoolId: $schoolId,
      specialtyId: $specialtyId,
      year: $year,
      month: $month,
      last: 10
    ) {
      edges {
        node {
          id year month monthName published
          specialty { id academicYear level { level} mainSpecialty { specialtyName}}
          period {
            date
            slots {
              assignedToId assignedToName start end hours courseId courseName session hall
              byId byName loginTime logoutTime duration hallUsed status remarks
            }
          }
        }
      }
    }
    allHalls(
      schoolId: $schoolId,
      last: 500
    ) {
      edges {
        node {
          id name
        }
      }
    }
    allCourses(
      schoolId: $schoolId,
      specialtyId: $specialtyId,
      last: 1000
    ) {
      edges {
        node {
          id 
          mainCourse { courseName }
          assignedTo { id fullName }
        }
      }
    }
    allAcademicYears
  }
`;