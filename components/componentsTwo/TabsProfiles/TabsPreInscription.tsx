import Link from 'next/link'
import React from 'react'

const TabsPreInscription = ({ params, page }: { params: any, page: number }) => {

  return (
          <div className='dark:text-white flex flex-row gap-4 items-center justify-between mb-2 md:gap-10 py-1 text-black'>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/PreInscription`} className={`${page === 1 ? "bg-slate-400 dark:bg-slate-700" : "bg-slate-200 dark:bg-slate-200 text-slate-400"} flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>PENDING</Link>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/PreInscription/Admitted`} className={`${page === 2 ? "bg-slate-400 dark:bg-slate-700" : "dark:bg-slate-200 text-slate-400"} flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>ADMITTED</Link>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/PreInscription/PendingOthers`} className={`${page === 3 ? "bg-slate-400 dark:bg-slate-700" : "dark:bg-slate-200 text-slate-400"} flex font-medium items-center justify-center md:text-lg py-1 rounded tracking-wider w-full`}>OTHERS</Link>
          </div>
        )
}

export default TabsPreInscription