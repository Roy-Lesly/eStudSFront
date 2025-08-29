'use client';
import React, { useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration'; import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import { EdgeMainSubjectSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import EditableSubjectTable from './EditableSubjectTable';
import { EdgeCustomUser } from '@/utils/Domain/schemas/interfaceGraphql';



const List = (
    { params, data, sp, apiTeachers }:
        { params: any, data: EdgeMainSubjectSec[], sp: any , apiTeachers: EdgeCustomUser[]}
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
                    apiTeachers={apiTeachers}
                    sp={sp}
                    p={params}
                />
            </div>
        </DefaultLayout>
    );
};

export default List;
