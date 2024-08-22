'use client';

import React, { useEffect, useState } from 'react'; // Importing icons
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/DefaultLayout';
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import { EdgeCustomUser, EdgeMainCourse, EdgeSpecialty, NodeMainCourse } from '@/utils/Domain/schemas/interfaceGraphql';
import { decodeUrlID } from '@/utils/functions';
import EditSelectedMainCourses from './EditSelectedMainCourses';
import { useRouter } from 'next/navigation';
import { ArrowRight, Delete } from 'lucide-react';


const List = (
    { params, apiMainCourses, apiAdmins, apiLects, searchParams, apiSpecialty }:
        { params: any, apiMainCourses: EdgeMainCourse[], apiAdmins: EdgeCustomUser[], apiLects: EdgeCustomUser[], searchParams: any, apiSpecialty: EdgeSpecialty }
) => {
    const { t } = useTranslation("common");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourses, setSelectedCourses] = useState<SelectedMainCousesAssignProps[] | []>([]);
    const [page, setPage] = useState<number>(1)
    const [count, setCount] = useState<number>(0)


    const filteredCourses = apiMainCourses?.slice(0, 100);

    useEffect(() => {
        if (count && searchTerm.length > 2) {
            const params = new URLSearchParams(searchParams);
            params.set("courseName", searchTerm);
            router.push(`?${params.toString()}`);
        }
        if (count && searchTerm.length < 3) {
            const params = new URLSearchParams(searchParams);
            params.set("courseName", "");
            router.push(`?${params.toString()}`);
        }
    }, [searchTerm, count]);

    const handleSelectCourse = (node: NodeMainCourse) => {
        if (!selectedCourses.find((c) => c.mainCourseId === parseInt(decodeUrlID(node.id)))) {
            const newCourse: SelectedMainCousesAssignProps = {
                mainCourseId: parseInt(decodeUrlID(node.id)),
                courseName: node.courseName,
                specialtyId: parseInt(searchParams.specialty_id),
                courseCode: "",
                courseCredit: 0,
                courseType: "",
                semester: searchParams.semester,
                hours: 0,
                hoursLeft: 0,
                assigned: false,
                completed: false,
                paid: false,
            };
            setSelectedCourses((prev) => [...prev, newCourse]);
        }
    };

    const handleUnselectCourse = (courseId: number) => {
        setSelectedCourses((prev) => prev.filter((course) => course.mainCourseId !== courseId));
    };

    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
            searchComponent={<></>}
            sidebar={
                <Sidebar
                    params={params}
                    menuGroups={GetMenuAdministration()}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
            }
            headerbar={
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    searchComponent={
                        <></>
                    }
                />
            }
        >
            <Breadcrumb
                department={t("Course Assignment")}
                subRoute="List"
                pageName={t("Course Assignment Page")}
                mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation`}
                subLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation`}
            />

            <div className='flex flex-col-reverse gap-10 md:flex-row w-full bg-slate-100 shadow-lg text-black rounded md:p-2'>



                {page === 1 ? <div className="w-full p-4">

                    <div className='flex flex-col gap-2 mb-4 shadow-xl px-4 md:px-6 py-1 bg-white rounded-lg'>
                        <h1 className='text-center w-full text-xl font-semibold'>{("Multiple Course Assignment")} - {t("Semester").toUpperCase()} {searchParams?.semester}</h1>
                        <h1 className='text-center w-full text-xl font-semibold'>{apiSpecialty?.node?.mainSpecialty.specialtyName} - {apiSpecialty?.node?.academicYear} - {apiSpecialty?.node?.level?.level}</h1>
                    </div>

                    <div className={`flex flex-col md:flex-row gap-4 transition-all duration-300 ${selectedCourses ? "md:flex-row" : ""
                        }`}>
                        <motion.div
                            layout
                            className={`text-black transition-all duration-300 ${selectedCourses ? "md:w-1/2" : "w-full"
                                }`}
                        >
                            <input
                                placeholder="Search Main Courses..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCount(1) }}
                                className="mb-4 w-full px-2 py-1 border rounded"
                            />

                            <div className="bg-white rounded-lg shadow-lg p-2 overflow-auto max-h-[70vh] text-black">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b bg-teal-100 rounded-lg">
                                            <th className="px-2 py-1 text-lg">{t("Course Name")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCourses?.map(({ node }) => (
                                            <tr
                                                key={node.id}
                                                className="hover:bg-slate-200 font-medium cursor-pointer"
                                                onClick={() => handleSelectCourse(node)}
                                            >
                                                <td className="p-2 tracking-wide">{node.courseName}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {selectedCourses.length > 0 && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                className="md:w-1/2 bg-white rounded-lg shadow p-4 text-black overflow-auto max-h-[70vh]"
                            >
                                <h2 className="text-lg font-semibold mb-4">{t("Selected Courses")} - {selectedCourses.length}</h2>
                                <ul className="space-y-1 font-semibold tracking-wide">
                                    {selectedCourses.map((course) => (
                                        <li
                                            key={course.mainCourseId}
                                            className="cursor-pointer flex bg-slate-50 px-3 py-1 rounded shadow-sm hover:bg-slate-200 justify-between"
                                            onClick={() => handleUnselectCourse(course.mainCourseId)}
                                        >
                                            <span>{course.courseName}</span>
                                            <Delete color='red' size={30} />
                                        </li>

                                    ))}
                                </ul>

                                <button
                                    onClick={() => setPage(2)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition w-full mt-4"
                                >
                                    {t("Next")} <ArrowRight size={18} />
                                </button>

                            </motion.div>
                        )}
                    </div>
                </div> : null}

                {page === 2 ?
                    <EditSelectedMainCourses
                        data={selectedCourses}
                        params={params}
                        searchParams={searchParams}
                        page={page}
                        setPage={setPage}
                        apiLecturer={apiLects}
                        apiAdmin={apiAdmins}
                    />
                    :
                    null}

            </div>

        </DefaultLayout>
    );
};

export default List;





export interface SelectedMainCousesAssignProps {
    mainCourseId: number
    courseName: string
    specialtyId: number
    courseCode: string
    courseCredit: number
    courseType: string
    semester: string
    hours: number
    hoursLeft: number
    assigned: boolean
    assignedToId?: number
    completed: boolean
    paid: boolean
}