import Link from 'next/link'
import React from 'react'

const MyTabs = ({ data, page }: { data: { page: number, link: string, title: string}[], page: number }) => {

    return (
        <div className='dark:text-white flex flex-row gap-4 items-center justify-between mb-2 md:gap-10 py-1 text-black'>
            {data && data.map((item: any, index: number) => (
                <Link key={item.page} href={item.link} className={`${item.page === page ? "bg-slate-400 dark:bg-slate-700" : "bg-slate-200 dark:bg-slate-200 text-slate-400"} 
                    flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}
                >
                    {item.title}
                </Link>
            ))}
        </div>
    )
}

export default MyTabs