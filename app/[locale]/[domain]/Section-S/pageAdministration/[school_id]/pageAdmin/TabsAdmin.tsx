import Link from 'next/link'
import React from 'react'

const TabsAdmin = ({ params, page }: { params: any, page: number }) => {

  return (
          <div className='dark:text-white flex flex-row gap-4 items-center justify-between mb-2 md:gap-10 py-1 text-black'>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin`} className={`${page === 0 ? "bg-slate-400 dark:bg-slate-700" : "bg-slate-200 dark:bg-slate-200 text-slate-400"} flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>Category</Link>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/SysConstant`} className={`${page === 1 ? "bg-slate-400 dark:bg-slate-700" : "dark:bg-slate-200 text-slate-400"} flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>System Value</Link>
          </div>
        )
}

export default TabsAdmin