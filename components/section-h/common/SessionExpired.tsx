import initTranslations from '@/initTranslations'
import Link from 'next/link'
import React from 'react'


const SessionExpired = async ({ params }: any) => {

  const { t } = await initTranslations(params.locale, ['common'])

  return (
    <div className='bg-slate-300 flex flex-col gap-10 h-screen items-center justify-center p-4 text-center tracking-widest w-full'>
        <div className='flex font-bold md:text-4xl text-2xl'>{t("session_expired")}</div>
        <div className='flex px-2 text-xl'>
            <Link 
                href={"/pageAuthentication/Login"}
                className='bg-slate-400 cursor-pointer hover:bg-slate-600 hover:text-blue-300 px-10 py-2 rounded text-black'
            >
                {t("login_again")}
            </Link>
        </div>
    </div>
  )
}

export default SessionExpired