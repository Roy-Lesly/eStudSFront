"use client";
import { protocol, RootApi } from '@/utils/config';
import { EdgeSchoolInfoHigher } from '@/utils/Domain/schemas/interfaceGraphql';
import { LogIn, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ResetPasswordForm = (
    { params, school, handleSubmit, handleChange, loading }:
        { params: any, school: EdgeSchoolInfoHigher, handleChange: any, handleSubmit: any, loading: boolean }
) => {

    const { t } = useTranslation("common");

    return (
        <>
            <div className="flex flex-col items-center mb-6">
                <Image
                    src={`${protocol + "api" + params.domain + RootApi}/media/${school?.node?.schoolIdentification?.logo}`}
                    alt="Logo"
                    width={70}
                    height={70}
                    className='rounded-full'
                />
                <h1 className="text-xl font-bold mt-2 text-center">{school?.node?.schoolIdentification?.name}</h1>
                <h1 className="text-xl text-teal-300 font-bold mt-6 text-center my-2">{t("PASSWORD RESET")}</h1>

                <span className='text-center mt-2 italic'>{t("Enter Token sent to your Email")}</span>
                <span className='text-center mb-2 italic'>{t("Enter New Password and Confirm Password")}</span>

            </div>

            <form
                method="post" onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div className="relative flex items-center">
                    <User className="absolute left-4 text-slate-700" size={20} />
                    <input
                        type="text"
                        name='token'
                        required
                        placeholder={t("Enter Token")}
                        onChange={handleChange}
                        className="w-full pl-16 pr-4 py-3 text-xl text-teal-800 font-semibold rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="relative flex items-center">
                    <User className="absolute left-4 text-slate-700" size={20} />
                    <input
                        type="password"
                        name='password'
                        required
                        placeholder={t("New Password")}
                        onChange={handleChange}
                        className="w-full pl-16 pr-4 py-3 text-xl text-teal-800 font-semibold rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="relative flex items-center">
                    <User className="absolute left-4 text-slate-700" size={20} />
                    <input
                        type="password"
                        name='confirm_password'
                        required
                        placeholder={t("Confirm Password")}
                        onChange={handleChange}
                        className="w-full pl-16 pr-4 py-3 text-xl text-teal-800 font-semibold rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex font-semibold justify-between text-indigo-100 mt-4">
                    <Link href={`/${params.domain}/pageAuthentication/Login`} className="dark:text-primary-500 font-medium hover:underline px-3 py-1 rounded text-primary-600 text-sm">Back To Login</Link>
                    {/* <Link href={`/${params.domain}/pageAuthentication/PasswordAndToken`} className="dark:text-primary-500 font-medium hover:underline px-3 py-1 rounded text-primary-600 text-sm">Enter Token</Link> */}

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`flex gap-4 items-center justify-center w-full py-3 mt-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${loading
                        ? 'bg-red cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                >
                    <LogIn size={18} />
                    {loading ? `${t("Loading")} ...` : `${t("Submit")}`}
                </button>


                <div className="mt-8 border-t pt-4 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3 font-medium">
                    <a
                        href="https://wa.me/237693358642?text=Hi%20there,%20I%20need%20support!"
                        className="hover:underline text-indigo-100"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("Contact Support")}
                    </a>

                    <Link href={`/${params.domain}/pageAuthentication/CheckUser`} className="hover:underline text-indigo-100">
                        {/* {t("Check User")} */}
                    </Link>
                </div>



            </form>

            <p className="text-center text-xs text-slate-500 mt-6">© 2022</p>
        </>
    );
}

export default ResetPasswordForm;
