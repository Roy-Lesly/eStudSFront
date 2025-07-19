"use client";
import { protocol, RootApi } from '@/utils/config';
import { EdgeSchoolInfoHigher } from '@/utils/Domain/schemas/interfaceGraphql';
import { Lock, LogIn, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';


const LoginForm = (
  { handleChange, params, loading, handleLogin, school }:
    { handleChange: any, params: any, loading: boolean, handleLogin: any, school: EdgeSchoolInfoHigher }
) => {

  const node = school?.node?.schoolIdentification
  const showParent = (node.hasSecondary || node.hasPrimary || node.hasVocational)
  const [parent, setParent] = useState<boolean>(false);

  const { t } = useTranslation("common");
  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <Image
          src={`${protocol + "api" + params.domain + RootApi}/media/${school?.node?.schoolIdentification?.logo}`}
          alt="Logo"
          width={75}
          height={75}
          className='rounded-full'
        />

        <h1 className="text-xl font-bold mt-2 text-center">{school?.node?.schoolIdentification?.name}</h1>

        <div className='flex gap-16 justify-center items-center w-full px-4'>
          <h1 className="text-xl text-teal-300 font-bold mt-6 text-center my-2">{t("LOGIN")}</h1>
          {showParent ? <button
            onClick={() => setParent(true)}
            className="py-2 px-6 rounded-2xl bg-slate-200 text-xl text-teal-700 font-bold mt-6 text-center my-2"
          >
            {t("Login As Parent")}
          </button>
            : null
          }
        </div>
      </div>

      <form
        method="post" onSubmit={handleLogin}
        className="space-y-10"
      >


        {showParent ? <div className="relative flex items-center">
          <User className="absolute left-4 text-slate-700" size={20} />
          <input
            type="text"
            name='matricle'
            required
            placeholder={t("Enter Matricle or Username")}
            onChange={handleChange}
            className="w-full pl-16 pr-4 py-4 text-xl text-teal-800 font-semibold rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

          :

          <div className="relative flex items-center">
            <User className="absolute left-4 text-slate-700" size={20} />
            <input
              type="text"
              name='matricle'
              required
              placeholder={t("Enter Matricle or Username")}
              onChange={handleChange}
              className="w-full pl-16 pr-4 py-4 text-xl text-teal-800 font-semibold rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        }


        <div className="relative flex items-center">
          <Lock className="absolute left-4 text-teal-700 font-semibold" size={20} />
          <input
            type="password"
            name='password'
            required
            placeholder={t("••••••••")}
            onChange={handleChange}
            className="w-full pl-16 py-4 tracking-widest rounded-md text-slate-700 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex font-semibold justify-between text-indigo-100 mt-4">
          <Link href="/pageAuthentication/ResetPassword" className="hover:underline">
            {t("Forgot Password")}?
          </Link>
          <Link href={`/${params.domain}/pageAuthentication/PasswordAndToken`} className="hover:underline">
            {t("Enter Token")}
          </Link>
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
          {loading ? `${t("Login In")} ...` : `${t("Login")}`}
        </button>


        <div className="mt-8 border-t pt-4 text-sm text-gray-600 flex items-center justify-between gap-3 font-medium">
          <a
            href="https://wa.me/237693358642?text=Hi%20there,%20I%20need%20support!"
            className="hover:underline text-indigo-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Contact Support")}
          </a>

          <Link href={`/${params.domain}/pageAuthentication/CheckUser`} className="hover:underline text-indigo-100">
            {t("Check User")}
          </Link>
        </div>



      </form>

      <p className="text-center text-xs text-slate-500 mt-6">© 2022</p>
    </>
  );
}

export default LoginForm;
