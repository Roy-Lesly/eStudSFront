'use client';
import React, { useState } from 'react';
import Sidebar from '@/section-p/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import EditableSubjectTable from './EditableSubjectTable';
import { EdgeMainSubjectPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';



const List = (
    { params, data, sp }:
    { params: any, data: EdgeMainSubjectPrim[], sp: any }
) => {

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
            sidebar={<Sidebar params={params} menuGroups={GetMenuAdministration()} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            headerbar={<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} searchComponent={<></>} />}
        >
            <div>
                <EditableSubjectTable
                    data={data}
                    sp={sp}
                    p={params}
                />
            </div>
        </DefaultLayout>
    );
};

export default List;
