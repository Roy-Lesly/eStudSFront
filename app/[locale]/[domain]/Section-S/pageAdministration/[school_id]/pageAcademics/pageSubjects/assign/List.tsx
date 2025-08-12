'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration'; import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import { useTranslation } from 'react-i18next';
import { EdgeMainSubject, EdgeSubjectSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { decodeUrlID } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from 'lucide-react';
import { gql } from '@apollo/client';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { errorLog } from '@/utils/graphql/GetAppolloClient';


type SubjectSec = {
    id: number;
    mainsubject: { id: number; subject_name: string };
};

const List = (
    { params, data, sp, allMainSubjects, dataAssignedSubjects }:
        { params: any, dataAssignedSubjects: EdgeSubjectSec[], allMainSubjects: EdgeMainSubject[], data: { assignedSubjects: SubjectSec[] }, sp: any }
) => {

    const router = useRouter();
    const { t } = useTranslation("common");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<EdgeMainSubject[]>([]);

    useEffect(() => {
        const assignedMainSubjectIds = dataAssignedSubjects?.map(item =>
            parseInt(decodeUrlID(item.node.mainsubject.id))
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

    const removeAssignedSubject = async (id: number) => {
        alert(`Are you sure to delete this - ${id}`);
        const payload = {
            id,
            delete: true,
        };

        try {
            const res = await ApiFactory({
                newData: payload,
                editData: payload,
                mutationName: "createUpdateDeleteSubjectSec",
                modelName: "subjectsec",
                successField: "id",
                query,
                router: null,
                params: params,
                redirect: false,
                reload: true,
                returnResponseField: true,
                redirectPath: ``,
                actionLabel: "processing",
            });

            console.log(res);

            if (res === null) {
                window.location.reload()
            }
        } catch (error) {
            errorLog(error);
        }
    };

    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
            sidebar={<Sidebar params={params} menuGroups={GetMenuAdministration()} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            headerbar={<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} searchComponent={<></>} />}
        >
            <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-100 rounded-md">

                {/* LEFT SIDE */}
                <div className="w-full md:w-1/2 p-4 bg-white rounded shadow-xl border-slate-200 border flex flex-col gap-3">
                    <h2 className="font-bold text-lg text-center">Available Subjects</h2>
                    {filteredSubjects.map(subject => (
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
                    {!filteredSubjects.length && <p className="text-center text-gray-500">No more subjects to assign.</p>}
                </div>

                {/* RIGHT SIDE */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">

                    {/* Top Section */}
                    <div className="p-4 bg-white rounded shadow-xl border-slate-200 border flex flex-col gap-3">
                        <h2 className="font-bold text-lg text-center">Selected Subjects</h2>
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
                                    onClick={() => router.push(`/${params.locale}/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageAcademics/pageSubjects/fill/?classId=${sp?.classId}&ids=${JSON.stringify(selectedSubjects)}`)}
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
                    <div className="p-4 bg-white rounded shadow-2xl border-slate-200 border flex flex-col gap-3">
                        <h2 className="font-bold text-lg text-center">{t("Already Assigned Subjects")}</h2>
                        {dataAssignedSubjects?.length ? (
                            dataAssignedSubjects?.map((subject: EdgeSubjectSec) => (
                                <div key={subject.node.id} className="flex justify-between items-center border p-2 rounded hover:bg-gray-50">
                                    <span>{subject.node.mainsubject.subjectName}</span>
                                    <button
                                        onClick={() => removeAssignedSubject(parseInt(decodeUrlID(subject.node.id)))}
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
        </DefaultLayout>
    );
};

export default List;




const query = gql`
    mutation CreateUpdateDeleteSubjectSec(
        $id: ID,
        $delete: Boolean!
    ) {
        createUpdateDeleteSubjectSec (
            id: $id,
            delete: $delete
        ) {
            subjectsec {
              id
            }
        }
    }
`;