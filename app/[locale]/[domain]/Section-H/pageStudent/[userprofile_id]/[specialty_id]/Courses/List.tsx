'use client';

import React, { FC, useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { EdgeDomain, EdgeMainCourse, EdgeCourse, EdgeLevel, EdgeSpecialty } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import MyTabs from '@/MyTabs';
import ExcelExporter from '@/ExcelExporter';
import ButtonAction from '@/section-h/Buttons/ButtonAction';
import MyModal from '@/MyModals/MyModal';
import { FaPlus } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import ModalCUDCourse from '@/MyModals/ModalCUDCourse';


export const metadata: Metadata = {
    title: "Courses Page",
    description: "This is Courses Page Admin Settings",
};

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState(0);
    const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);


    const Columns: TableColumn<EdgeCourse>[] = [
        { header: "#", align: "center", render: (_item: EdgeCourse, index: number) => index + 1, },
        { header: "Course Name", accessor: "node.mainCourse.courseName", align: "left" },
        // { header: "Class", accessor: "node.specialty.mainSpecialty.specialtyName", align: "center" },
        // { header: "Year", accessor: "node.specialty.academicYear", align: "center" },
        { header: "Sem", accessor: "node.semester", align: "center" },
        // {
        //     header: "View", align: "center",
        //     render: (item) => <div className='flex flex-row gap-2 justify-center'>
        //         <ButtonAction data={item} type='edit' action={() => { setShowModal({ show: true, type: "update" }); setSelectedItem(item) }} />
        //     </div>
        // },
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
                            const levelA = a.node.specialty.level.level;
                            const levelB = b.node.specialty.level.level;
                            if (courseNameA > courseNameB) return 1;
                            if (courseNameA < courseNameB) return -1;
                            if (levelA > levelB) return 1;
                            if (levelA < levelB) return -1;
                        })}
                    columns={Columns}
                />
                :
                <ServerError type="notFound" item="Courses" />
            }
        </div>



        <MyModal
            component={<ModalCUDCourse
                setOpenModal={setShowModal}
                actionType={showModal?.type || "create"}
                selectedItem={selectedItem}
                extraData={{ specialties: data?.allSpecialties?.edges, mainCourses: data?.allMainCourses?.edges, teachers: data?.allCustomUsers?.edges }}
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