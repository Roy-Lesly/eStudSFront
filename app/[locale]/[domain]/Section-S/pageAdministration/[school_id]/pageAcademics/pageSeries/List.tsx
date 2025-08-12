'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { EdgeMainSubject, EdgeSeries, TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import ExcelExporter from '@/ExcelExporter';
import ButtonAction from '@/section-h/Buttons/ButtonAction';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import MyModal from '@/MyModals/MyModal';
import { useTranslation } from 'react-i18next';
import { ModalSeries } from './ModalSeries';


const List = (
    { p, data, sp, apiLevel }:
        { p: any; data: any, sp: any, apiLevel: any }
) => {

    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
    const [selectedItem, setSelectedItem] = useState<EdgeSeries | null>(null);
    const router = useRouter();

    const Columns: TableColumn<EdgeSeries>[] = [
        { header: "#", align: "center", render: (_item: EdgeSeries, index: number) => index + 1, },
        {
            header: `${t("Class")} / ${t("Series")}`, align: "left", render: (e: EdgeSeries) => (
                <div className='flex justify-between gap-2'>
                    <span>{e?.node?.classroom}</span>
                    <span>{e?.node?.name}</span>
                </div>
            )
        },
        {
            header: `${t("Subjects")}`, align: "center", render: (item: EdgeSeries) => (
                <div className="flex flex-wrap gap-1">
                    {item.node.subjectList
                        ?.slice() // Make a shallow copy to avoid mutating original data
                        .sort((a: string, b: string) => a.localeCompare(b))
                        .map((subject: string, idx: number) => (
                            <span
                                key={idx}
                                className="bg-blue-100 text-blue-900 tracking-wider px-2 py-1 text-sm rounded-3xl"
                            >
                                {subject}
                            </span>
                        ))}
                </div>
            )
        },
        {
            header: `${t("View")}`, align: "center",
            render: (item) => <div
                className="flex flex-row gap-2 items-center justify-center p-1 rounded-full"
            >
                <div className='flex flex-row gap-2'>
                    <ButtonAction data={item} type='delete' action={() => { setShowModal({ show: true, type: "delete" }); setSelectedItem(item) }} />
                    <ButtonAction data={item} type='edit' action={() => { setShowModal({ show: true, type: "update" }); setSelectedItem(item) }} />
                </div>
            </div>
        },
    ];

    return (
        <DefaultLayout
            pageType='admin'
            domain={p.domain}
            downloadComponent={<></>
                // <ExcelExporter
                //   data={activeTab ? data?.allMainSpecialties?.edges : data?.allSpecialties?.edges}
                //   title={activeTab ? "MainSpecialties" : "Specialties"}
                //   type={activeTab ? "MainSpecialty" : "Specialty"}
                //   page={activeTab ? "list_main_specialty" : "list_specialty"}
                //   searchParams={activeTab ? { "name": "List" } : sp}
                // />
            }
            searchComponent={
                <SearchMultiple
                    names={['level', 'stream']}
                    link={`/${p.domain}/Section-S/pageAdministration/${p.school_id}/pageAcademics/pageSeries`}
                />
            }
            sidebar={
                <Sidebar
                    params={p}
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

            <div className="bg-gray-50 flex flex-col items-center justify-center">


                <div className="bg-white mx-auto rounded shadow w-full">
                    {
                        data?.length ?
                            <MyTableComp
                                columns={Columns}
                                data={
                                    data.sort((a: EdgeSeries, b: EdgeSeries) => {
                                        const classroomA = a.node.classroom.toLowerCase();
                                        const classroomB = b.node.classroom.toLowerCase();
                                        return classroomA.localeCompare(classroomB);
                                    })}
                                table_title={t("Series")}
                                button_type={"add"}
                                button_action={() => { setShowModal({ show: true, type: "create" }); setSelectedItem(null) }}
                            />
                            :
                            null
                    }
                </div>


                {<MyModal
                    component={<ModalSeries
                        p={p}
                        sp={sp}
                        isOpen={showModal?.show || false}
                        selectedSeries={selectedItem?.node}
                        onClose={() =>setShowModal({ show: false, type: "create" })}
                        actionType={showModal?.type || "create"}
                        apiLevel={apiLevel}
                        // apiMainSubjects={apiMainSubjects}
                    />}
                    openState={showModal?.show || false}
                    onClose={() => setShowModal({ show: false, type: "create" })}
                    title={showModal?.type || ""}
                    classname=''
                />
                }


            </div>
        </DefaultLayout>
    );
};

export default List;

