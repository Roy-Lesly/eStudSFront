'use client';

import React, { FC, useState } from 'react';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyModal from '@/MyModals/MyModal';
import ModalCUDCourse from '@/MyModals/ModalCUDCourse';
import { useTranslation } from 'react-i18next';


export const metadata: Metadata = {
    title: "Courses Page",
    description: "e-conneq School System. Courses Page Admin Settings",
};

const List = ({ data, p }: { p: any; data: any, searchParams: any }) => {
    const { t } = useTranslation("common");
    const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const Columns: TableColumn<EdgeCourse>[] = [
        { header: "#", align: "center", render: (_item: EdgeCourse, index: number) => index + 1, },
        { header: "Course Name", accessor: "node.mainCourse.courseName", align: "left" },
        // { header: "Class", accessor: "node.specialty.mainSpecialty.specialtyName", align: "center" },
        { header: "Sem", accessor: "node.semester", align: "center" },
    ];

    return (
        <div className="bg-gray-50 flex flex-col items-center justify-center pb-20">


            <div className="bg-white mt-2 mx-auto rounded shadow w-full">

                {data && !data?.error ?
                    <MyTableComp
                        data={
                            data?.allCourses?.edges.sort((a: EdgeCourse, b: EdgeCourse) => {
                                const courseNameA = a.node.mainCourse.courseName.toLowerCase();
                                const courseNameB = b.node.mainCourse.courseName.toLowerCase();
                                const semesterA = a.node.semester;
                                const semesterB = b.node.semester;
                                if (semesterA > semesterB) return 1;
                                if (semesterA < semesterB) return -1;
                                return courseNameA.localeCompare(courseNameB);
                            })}
                        columns={Columns}
                    />
                    :
                    <ServerError type="notFound" item={t("Courses")} />
                }
            </div>



            <MyModal
                component={<ModalCUDCourse
                    params={p}
                    setOpenModal={setShowModal}
                    actionType={showModal?.type || "create"}
                    selectedItem={selectedItem}
                    extraData={{ specialties: data?.allSpecialties?.edges, mainCourses: data?.allMainCourses?.edges, teachers: data?.allCustomusers?.edges }}
                />}
                openState={showModal?.show || false}
                onClose={() => setShowModal({ show: false, type: "create" })}
                title={showModal?.type || ""}
                classname=''
            />


        </div>
    );
};

export default List;