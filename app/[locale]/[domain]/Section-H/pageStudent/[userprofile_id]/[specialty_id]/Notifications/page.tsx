import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Notification Page",
    description: "Student Notification Page",
};

const page = async ({
    params,
}: {
    params: any;
    searchParams: any;
}) => {

    const p = await params;

    return (
        <div className='h-screen mx-1 my-16 p-1 rounded text-black'>
            coming soon ...
        </div>
    )
}

export default page