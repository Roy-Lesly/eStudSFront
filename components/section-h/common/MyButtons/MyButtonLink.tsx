import React from 'react'
import MyButtonLoading from '../MyButtons/MyButtonLoading'
import Link from 'next/link'

const MyButtonLink = ({ title, clicked , href}: { title: string, href: string, clicked?: boolean, }) => {

    return <>
        {clicked ?
        <button className={`p-2 rounded-md text-white flex items-center justify-center`}>
            <span className={`border-bluedash animate-spin border-6  border-t-transparent flex h-[34px]  rounded-full w-[34px]`}>.</span>
        </button>

            :
            <Link href={href} className={`bg-blue-700 font-medium px-6 py-2 rounded-md text-white`}>
                {title}
            </Link>
        }
    </>


}

export default MyButtonLink