'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration'; import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import { useTranslation } from 'react-i18next';
import { EdgeMainSubjectSec, NodeSeries, EdgeSubjectSec, EdgeSeries } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { decodeUrlID } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, PlusCircle } from 'lucide-react';
import { gql, useLazyQuery } from '@apollo/client';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { errorLog } from '@/utils/graphql/GetAppolloClient';
import { FaArrowRight } from 'react-icons/fa';
import MyModal from '@/components/MyModals/MyModal';
import { ModalSeries } from '../../pageSeries/ModalSeries';


const List = (
    { params, apiLevel, sp, selectedSeries, dataAssignedSubjects }:
        { params: any, dataAssignedSubjects: EdgeSubjectSec[], selectedSeries: NodeSeries, sp: any, apiLevel: string[] }
) => {

    console.log(selectedSeries);
    const router = useRouter();
    const { t } = useTranslation("common");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();

    const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<EdgeMainSubjectSec[]>([]);
    const allMainSubjects = selectedSeries?.mainsubjects?.edges

    const [getClassSeries, { data: seriesData, loading: loadingSeries }] = useLazyQuery(GET_CLASS_SERIES);

    useEffect(() => {
        getClassSeries({
            variables: { level: selectedSeries?.level }
        });
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

            if (res === null) {
                window.location.reload()
            }
        } catch (error) {
            errorLog(error);
        }
    };

const changeSeries = (e: any) => {
  const confirmed = window.confirm("Are you sure you want to change the series?");
  if (confirmed) {
    router.push(`/${params.locale}/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageAcademics/pageSubjects/assign/?classId=${sp?.classId}&seriesId=${e.target.value}`)
  }
};

    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
            sidebar={<Sidebar params={params} menuGroups={GetMenuAdministration()} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            headerbar={<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} searchComponent={<></>} />}
        >
            <div className='rounded-lg shadow-lg mt-2 mx-4 p-2 md:p-4'>
                <div className='flex gap-6'>
                    <span className='w-1/4'>{t("Class")}:</span>
                    <span className='w-3/4 text-black font-medium italic'>{selectedSeries.level}</span>
                </div>
                <div className='flex gap-6'>
                    <span className='w-1/4'>{t("Series")}:</span>
                    <div className='flex justify-between w-3/4 items-center'>
                        <span className='text-black font-medium italic'>{selectedSeries.name}</span>
                        <select
                            onChange={(e: any) => changeSeries(e)}
                            className='text-black font-medium italic py-1 px-2'
                        >
                            <option key={0} value={""}>---------------</option>
                            {seriesData?.allSeries?.edges?.map((item: EdgeSeries) => <option key={item?.node?.id} value={decodeUrlID(item?.node?.id)}>{item?.node?.name}</option>)}

                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-100 rounded-md">


                {/* LEFT SIDE */}
                <div className="w-full text-black md:w-1/2 p-4 bg-white rounded shadow-xl border-slate-200 border flex flex-col gap-3">
                    <h2 className="font-bold text-lg text-center">{t("Search Here")}</h2>
                    {filteredSubjects?.map(subject => (
                        <div key={subject?.node.id} className="flex justify-between items-center border p-2 rounded hover:bg-gray-50">
                            <span className='font-bold'>{subject?.node?.subjectCode}</span>
                            <span className='text-left'>{subject?.node?.subjectName}</span>
                            <button
                                onClick={() => addSubject(parseInt(decodeUrlID(subject?.node.id)))}
                                className="flex gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                                {t("Add")} <FaArrowRight size={22} color='white' />
                            </button>
                        </div>
                    ))}

                    {!allMainSubjects?.length ?
                        <p className="text-center text-slate-700">
                            {t("This Series has no subjects available.")}
                        </p>
                        : !filteredSubjects?.length && !selectedSubjects?.length ? <p className="text-center text-slate-700">
                            {t("All subjects are already assigned.")}
                        </p>
                            : !filteredSubjects?.length && selectedSubjects?.length ? <p className="text-center text-slate-700">
                                {t("You’ve selected all available subjects.")}
                            </p>
                                : null}


                    <div className='flex items-center justify-center mt-4 md:mt-6'>
                        <button
                            onClick={() => { setShowModal({ show: true, type: "create" }) }}
                            className='flex gap-2 rounded-lg shadow-lg px-4 py-2 bg-green-200 border border-slate-100 font-medium tracking-wide'>
                            <PlusCircle size={25} /> {t("Add Subjects to Series")}
                        </button>
                    </div>
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
                                    onClick={() => router.push(`/${params.locale}/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageAcademics/pageSubjects/fill/?classId=${sp?.classId}&seriesId=${sp?.seriesId}&ids=${JSON.stringify(selectedSubjects)}`)}
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
                        <h2 className="font-bold text-lg text-center">{t("Already Assigned Subjects")} - {selectedSeries?.name}</h2>
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

                    {<MyModal
                        component={<ModalSeries
                            p={params}
                            sp={sp}
                            isOpen={showModal?.show || false}
                            selectedSeries={selectedSeries}
                            onClose={() => setShowModal({ show: false, type: "create" })}
                            actionType={showModal?.type || "create"}
                            apiLevel={apiLevel}
                        />}
                        openState={showModal?.show || false}
                        onClose={() => setShowModal({ show: false, type: "create" })}
                        title={showModal?.type || ""}
                        classname=''
                    />
                    }

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

const GET_CLASS_SERIES = gql`
 query GetData (
    $level: String! 
 ) {
    allSeries (
      level: $level
      last: 100
    ){
      edges {
        node {
            id name
        }
      }
    }
  }
`;