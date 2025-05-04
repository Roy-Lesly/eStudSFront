'use client';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import React from 'react';


const Continue = (
    { domain, params }
    :
    { domain: string, params: any }
) => {

    const token = localStorage.getItem("token");
    const user: JwtPayload | null = token ? jwtDecode(token) : null


    return (
        <>
        { user ?
            <Link
            href={`/${domain}/Section-H/pageLecturer/${params.school_id}/${user.user_id}/pageMyCourses`}
            className="bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium hover:bg-blue-700 px-10 py-2 rounded-md text-white text-xl transition"
        >
            Continue
        </Link>
        :
        null
        }
        </>
    )
}

export default Continue
