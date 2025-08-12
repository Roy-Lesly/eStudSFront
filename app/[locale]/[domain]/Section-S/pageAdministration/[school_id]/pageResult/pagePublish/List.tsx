'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { EdgePublish, NodePublish } from '@/Domain/schemas/interfaceGraphql';
import { FaArrowRight } from 'react-icons/fa';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ServerError from '@/ServerError';
import { GrStatusGood } from 'react-icons/gr';
import MessageModal from '@/components/componentsTwo/MessageModal';
import { useTranslation } from 'react-i18next';


export const metadata: Metadata = {
    title: "Publish Page",
    description: "e-conneq School System. Publish Page Admin Settings",
};

const List = (
    { p, apiDataPublish }:
        { p: any, sp: any; apiDataPublish: EdgePublish[], apiYears: string[] }
) => {

    console.log(apiDataPublish);
    console.log(apiDataPublish?.length);

    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const Columns: TableColumn<EdgePublish>[] = [
        { header: "#", align: "center", render: (_item: EdgePublish, index: number) => index + 1, },
        { header: `${t("Specialty")}`, accessor: "node.specialty.mainSpecialty.specialtyName", align: "left" },
        {
            header: `${t("Year")} / ${t("Level")}`, align: "left", render: (item) => <button
                className=""
            >
                {item.node.specialty.academicYear} / {item.node.specialty.level.level}
            </button>,
        },
        { header: `${t("Semester")}`, accessor: "node.semester", align: "center" },
        {
            header: `${t("ca")}`, align: "center", render: (item) => <div
                className=""
            >
                <PublishButton
                    p={p}
                    isActive={item.node.ca}
                    data={item.node}
                    type='ca'
                />
            </div>,
        },
        {
            header: `${t("exam")}`, align: "center", render: (item) => <div
                className=""
            >
                <PublishButton
                    p={p}
                    isActive={item.node.exam}
                    data={item.node}
                    type='exam'
                />
            </div>,
        },
        {
            header: `${t("resit")}`, align: "center", render: (item) => <div
                className=""
            >
                <PublishButton
                    p={p}
                    isActive={item.node.resit}
                    data={item.node}
                    type='resit'
                />
            </div>,
        },
    ];

    return (
        <DefaultLayout
            pageType='admin'
            domain={p.domain}
            downloadComponent={<></>}
            searchComponent={
                <SearchMultiple
                    names={['academicYear', 'level']}
                    link={`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageResult/pagePublish`}
                    select={[]}
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

            {apiDataPublish ?
                apiDataPublish?.length ?
                    <div className='flex flex-col gap-10'>
                        <div className='my-2'>
                            <h2 className='text-2xl italic text-white py-1 rounded-t-xl text-center font-semibold bg-blue-700'>{t("Publish").toUpperCase()} - {t("Semester").toUpperCase()} I</h2>
                            <MyTableComp
                                data={
                                    apiDataPublish.filter((item: EdgePublish) => item.node.semester === "I").sort((a: EdgePublish, b: EdgePublish) => {
                                        const levelA = a.node.specialty.level.level;
                                        const levelB = b.node.specialty.level.level;
                                        return levelA > levelB ? 1 : -1;
                                    })}
                                columns={Columns}
                            />
                        </div>
                        <div className='my-2'>
                            <h2 className='text-2xl italic text-white py-1 rounded-t-xl text-center font-semibold bg-blue-700'>{t("Publish").toUpperCase()} - {t("Semester").toUpperCase()} II</h2>
                            <MyTableComp
                                data={
                                    apiDataPublish?.filter((item: EdgePublish) => item.node.semester === "II").sort((a: EdgePublish, b: EdgePublish) => {
                                        const levelA = a.node.specialty.level.level;
                                        const levelB = b.node.specialty.level.level;
                                        return levelA > levelB ? 1 : -1;
                                    })}
                                columns={Columns}
                            />
                        </div>
                    </div>
                    :
                    <ServerError type="notFound" item={t("Publish")} />

                :
                <ServerError type="network" item={t("Publish")} />
            }

        </DefaultLayout>
    );
};

export default List;


const PublishButton = (
    { p, isActive, data, type }
        :
        { p: any, isActive: boolean, data: NodePublish, type: "ca" | "exam" | "resit" }
) => {

    return <div className="flex items-center justify-center w-32">
        {isActive ?
            <GrStatusGood color='green' size={30} />
            :
            <div className="flex h-7 items-center justify-center rounded-full w-7">
                <MessageModal
                    table="portal_publish_result"
                    type="update" params={p} data={data}
                    icon={<FaArrowRight
                        size={20} />}
                    extra_data={{ field_type: type, action_on: "publish", state: isActive }}
                    customClassName='bg-red-500'
                />
            </div>}
    </div>
}