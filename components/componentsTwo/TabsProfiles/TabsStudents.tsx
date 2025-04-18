import Link from 'next/link'
import React from 'react'

const TabsStudents = ({ params, page }: { params: any, page: number }) => {

  return (
          <div className='dark:text-white flex flex-row gap-2 items-center justify-between mb-2 md:gap-6 py-1 text-black'>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Info`} className={`${page === 1 ? "bg-slate-400 dark:bg-slate-700" : "bg-slate-200  dark:bg-slate-200 text-slate-400"} flex text-center font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>Students Info</Link>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Classes`} className={`${page === 2 ? "bg-slate-400 dark:bg-slate-700" : "bg-slate-200 dark:bg-slate-200 text-slate-400"} flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>Classes</Link>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Fees`} className={`${page === 3 ? "bg-slate-400 dark:bg-slate-700" : "bg-slate-200 dark:bg-slate-200 text-slate-400"} flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>Fees</Link>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Results`} className={`${page === 4 ? "bg-slate-400 dark:bg-slate-700" : "bg-slate-200 dark:bg-slate-200 text-slate-400"} flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>Result</Link>
          </div>
        )
}

export default TabsStudents