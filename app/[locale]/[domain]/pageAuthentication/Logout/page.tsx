'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { ActionLogout } from '@/serverActions/AuthActions';
import { useTranslation } from 'react-i18next';


const LogOut = () => {

  return (
    <LogOutForm />
  )
}

export default LogOut


const LogOutForm = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation("common");

  const onSubmit = async () => {
    setLoading(true);
    // const response = await ActionLogout()

    // if (response) {
    localStorage.removeItem("token");
    router.push("/pageAuthentication/Login")
    // }

    setLoading(false)
  }

  return (
    <section className="bg-boxdark dark:bg-gray-100">
      <div className="flex flex-col h-screen items-center justify-center lg:py-0 md:h-screen mx-auto px-6 py-8">


        <div className="bg-gray dark:bg-gray-800 dark:border dark:border-gray-700 md:mt-0 rounded-lg shadow sm:max-w-md w-full xl:p-0">
          <div className="flex flex-col p-6 sm:p-8">

            <form className="flex flex-col gap-10">
              <button
                onClick={onSubmit}
                type='button'
                className="bg-primary-600 bg-red dark:focus:ring-primary-800 dark:hover:bg-primary focus:outline-none focus:ring-4 focus:ring-primary font-medium hover:bg-primary italic mb-10 md:text-xl px-5 py-2.5 rounded text-center text-white tracking-widest w-full"
                disabled={loading}
              >
                {t("Logout")}
              </button>

            </form>

            <div className="flex items-center justify-between">
              <span onClick={() => { router.back() }} className="bg-teal-50 border-2 border-slate-200 cursor-pointer font-bold hover:bg-slate-200 px-4 py-2 rounded text-slate-800 text-xl tracking-widest">Go Back</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}