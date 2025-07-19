'use client';
import React, { useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-s/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import { EdgeMainSubject } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import EditableSubjectTable from './EditableSubjectTable';



const List = (
    { params, data, sp }:
    { params: any, data: EdgeMainSubject[], sp: any }
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
