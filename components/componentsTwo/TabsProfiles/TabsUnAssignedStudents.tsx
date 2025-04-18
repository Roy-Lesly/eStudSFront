import Link from 'next/link'
import React from 'react'

const TabsUnAssignedStudents = ({ params, page }: { params: any, page: number }) => {

  return (
          <div className='dark:text-white flex flex-row gap-2 items-center justify-between mb-2 md:gap-6 py-1 text-black'>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/UnAssignedCampusStudents`} className={`${page === 1 ? "bg-slate-400 dark:bg-slate-700" : "bg-slate-200 dark:bg-slate-200 text-slate-400"} flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>This Campus</Link>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/UnAssignedAllStudents`} className={`${page === 2 ? "bg-slate-400 dark:bg-slate-700" : "bg-slate-200 dark:bg-slate-200 text-slate-400"} flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>Other Campus</Link>
          </div>
        )
}

export default TabsUnAssignedStudents