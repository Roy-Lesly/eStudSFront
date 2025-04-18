'use client';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/DefaultLayout';
import Header from '@/section-s/Header/Header';
import React, { useState } from 'react'
import ProfilePage from '../pageAuthentication/MyProfilePage/ProfilePage';
import { MenuLecturer } from '@/section-s/Sidebar/MenuLecturer';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';

const RoleHandle = ({
    params,
}: {
    params: { school_id: string, domain: string, pageTitle: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    if (params.pageTitle === "Profile") {
        return (
            <DefaultLayout
            domain={params.domain}
                headerbar={<Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />}
            >
                <Breadcrumb 
                    department='Profile' 
                    subRoute="Dashboard" 
                    pageName='Profile' 
                    mainLink={""}
                />

                <div className='flex flex-col gap-2'>
                    <ProfilePage />
                </div>
            </DefaultLayout>
        )
    }
    else if (params.pageTitle === "Administration") {
        return (
            <DefaultLayout
            domain={params.domain}

                sidebar={<Sidebar
                    params={params.domain}
                    menuGroups={getMenuAdministration(params)}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />}
                headerbar={<Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />}
            >
                <Breadcrumb 
                    department='Administration' 
                    subRoute="Dashboard" 
                    pageName='Administration' 
                    mainLink={""}
                />
                <div className='flex flex-col gap-2'>
                    {/* <ECommerce /> */}
                </div>
            </DefaultLayout>
        )
    }
    else if (params.pageTitle === "Lecturer") {
        return (
            <DefaultLayout
            domain={params.domain}

                sidebar={<Sidebar
                    params={params}
                    menuGroups={MenuLecturer}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />}
                headerbar={<Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />}
            >
                <Breadcrumb 
                    department='Lecturer' 
                    subRoute="Dashboard" 
                    pageName='Lecturer' 
                    mainLink={""}
                />
                <div className='flex flex-col gap-2'>
                    {/* <ECommerce /> */}
                </div>
            </DefaultLayout>
        )
    }
}

export default RoleHandle