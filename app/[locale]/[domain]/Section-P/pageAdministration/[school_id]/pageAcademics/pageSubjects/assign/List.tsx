'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/section-p/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import { useTranslation } from 'react-i18next';
import { decodeUrlID } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from 'lucide-react';
import { EdgeClassRoomPrim, EdgeMainSubjectPrim, EdgeSubjectPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';


const List = (
    { params, sp, allMainSubjects, dataAssignedSubjects, apiClassroom }:
        { params: any, dataAssignedSubjects: EdgeSubjectPrim[], allMainSubjects: EdgeMainSubjectPrim[], sp: any, apiClassroom: EdgeClassRoomPrim }
) => {

    const router = useRouter();
    const { t } = useTranslation("common");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<EdgeMainSubjectPrim[]>([]);

    useEffect(() => {
        const assignedMainSubjectIds = dataAssignedSubjects?.map(item =>
            parseInt(decodeUrlID(item.node.mainsubjectprim.id))
        );

        const filtered = allMainSubjects?.filter(subject =>
            !assignedMainSubjectIds?.includes(parseInt(decodeUrlID(subject.node.id))) &&
            !selectedSubjects?.includes(parseInt(decodeUrlID(subject.node.id)))
        );

        setFilteredSubjects(filtered);
    }, [selectedSubjects, allMainSubjects, dataAssignedSubjects]);

    const addSubject = (id: number) => {
        setSelectedSubjects(prev => [...prev, id]);
    };

    const removeSubject = (id: number) => {
        setSelectedSubjects(prev => prev.filter(sid => sid !== id));
    };

    const removeAssignedSubject = (id: number) => {
        // Call your API to unassign here (optional)
        alert(`Unassign subject ID ${id}`);
    };

    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
            sidebar={<Sidebar params={params} menuGroups={GetMenuAdministration()} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            headerbar={<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} searchComponent={<></>} />}
        >
            <div className='flex flex-col bg-slate-50'>
               
                <div className='flex justify-center items-center text-center bg-white shadow-2xl rounded py-2  m-4'>
                    <span className='font-extrabold text-xl'>{apiClassroom.node.level} - {apiClassroom.node.academicYear}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-100 rounded-md">

                    {/* LEFT SIDE */}
                    <div className="w-full md:w-1/2 p-4 bg-white rounded shadow-xl flex flex-col gap-3">
                        <h2 className="font-bold text-lg text-center">Available Subjects</h2>
                        {filteredSubjects?.map(subject => (
                            <div key={subject?.node.id} className="flex justify-between items-center border p-2 rounded hover:bg-gray-50">
                                <span>{subject?.node?.subjectName}</span>
                                <button
                                    onClick={() => addSubject(parseInt(decodeUrlID(subject?.node.id)))}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    ➡️ {t("Add")}
                                </button>
                            </div>
                        ))}
                        {!filteredSubjects?.length && <p className="text-center text-gray-500">{t("No more subjects to assign")}.</p>}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6">

                        {/* Top Section */}
                        <div className="p-4 bg-white rounded shadow-xl flex flex-col gap-3">
                            <h2 className="font-bold text-lg text-center">{selectedSubjects.length} - {t("Selected Subjects")}</h2>
                            {selectedSubjects.length ? (
                                selectedSubjects.map(id => {
                                    const subject = allMainSubjects.find(s => parseInt(decodeUrlID(s.node.id)) === id);
                                    return (
                                        <div key={id} className="flex justify-between items-center border p-2 rounded hover:bg-gray-50">
                                            <span>{subject?.node.subjectName}</span>
                                            <button
                                                onClick={() => removeSubject(id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                ❌ {t("Remove")}
                                            </button>
                                        </div>
                                    );
                                })
                            )
                                :
                                <p className="text-center text-gray-500">{t("No subjects selected yet")}.</p>
                            }

                            {selectedSubjects?.length ?
                                <div className='flex justify-center'>
                                    <button
                                        onClick={() => router.push(`/${params.locale}/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageAcademics/pageSubjects/fill/?classId=${sp?.classId}&ids=${JSON.stringify(selectedSubjects)}`)}
                                        className="flex justify-center text-center w-32 items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200"
                                        aria-label={t("Next")}
                                    >
                                        {t("Next")}
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                :
                                null}

                        </div>


                        {/* Bottom Section */}
                        <div className="p-4 bg-white rounded shadow-xl flex flex-col gap-3">
                            <h2 className="font-bold text-lg text-center">{dataAssignedSubjects?.length} - {t("Already Assigned Subjects")}</h2>
                            {dataAssignedSubjects?.length ? (
                                dataAssignedSubjects?.map((subject: EdgeSubjectPrim) => (
                                    <div key={subject.node.id} className="flex justify-between items-center border p-2 rounded hover:bg-gray-50">
                                        <span>{subject.node.mainsubjectprim.subjectName}</span>
                                        <button
                                            onClick={() => removeAssignedSubject(parseInt(decodeUrlID(subject.node.mainsubjectprim.id)))}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            ❌ {t("Unassign")}
                                        </button>
                                    </div>
                                ))
                            ) : <p className="text-center text-gray-500">{t("No subjects assigned yet")}.</p>}
                        </div>

                    </div>

                </div>
            </div>
        </DefaultLayout>
    );
};

export default List;
