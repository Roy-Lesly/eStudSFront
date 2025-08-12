"use client";
import { protocol, RootApi } from '@/utils/config';
import { EdgeSchoolHigherInfo } from '@/utils/Domain/schemas/interfaceGraphql';
import { Lock, LogIn, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';

const LoginForm = (
  { handleChange, params, loading, handleLogin, school }:
    { handleChange: any, params: any, loading: boolean, handleLogin: any, school: EdgeSchoolHigherInfo }
) => {

  const node = school?.node?.schoolIdentification;
  const showParent = (node.hasSecondary || node.hasPrimary || node.hasVocational);
  const [parent, setParent] = useState<boolean>(false);

  const { t } = useTranslation("common");

  const theme = {
    headingColor: parent ? "text-teal-500" : "text-indigo-400",
    buttonBg: parent ? "bg-teal-600 hover:bg-teal-700" : "bg-indigo-600 hover:bg-indigo-700",
    buttonTextColor: "text-white",
    buttonDisabledBg: parent ? "bg-teal-300 cursor-not-allowed" : "bg-indigo-300 cursor-not-allowed",
    inputFocusRing: parent ? "focus:ring-teal-500" : "focus:ring-indigo-500",
  };

  return (
    <>
      <div className="flex flex-col items-center mb-8 px-4">
        <Image
          src={`${protocol + "api" + params.domain + RootApi}/media/${school?.node?.schoolIdentification?.logo}`}
          alt="Logo"
          width={80}
          height={80}
          className="rounded-full shadow-md"
        />

        <h1 className="text-2xl font-extrabold mt-4 text-center text-gray-900 max-w-lg">
          {school?.node?.schoolIdentification?.name}
        </h1>

        <div className="flex items-center justify-center gap-8 w-full max-w-xl mt-6 px-2">

          <h2 className={`flex text-center text-2xl font-bold ${theme.headingColor}`}>
            {parent ? t("PARENT") : null} {t("LOGIN")}
          </h2>

          {showParent && (
            <button
              onClick={() => {
                setParent(!parent);
                handleChange({ target: { name: "parent", value: !parent } });
              }}
              className={`flex text-center items-center gap-2 rounded-full py-2 px-4 transition-colors duration-300
          ${parent
                  ? "bg-slate-300 text-teal-600 font-bold hover:bg-slate-400"
                  : "bg-teal-600 text-white font-medium hover:bg-teal-700"
                }`}
            >
              {parent ? t("Back") : t("As Parent")} {parent ? <FaArrowCircleLeft /> : <FaArrowCircleRight />}
            </button>
          )}
        </div>
      </div>


      <form
        method="post" onSubmit={handleLogin}
        className="space-y-10"
      >
        {parent ? (
          <div className="relative flex items-center">
            <User className="absolute left-4 text-slate-700" size={20} />
            <input
              type="number"
              name='matricle'
              required
              placeholder={t("Parent Telephone Number")}
              onChange={handleChange}
              className={`w-full pl-16 pr-4 py-4 text-xl text-teal-800 font-semibold rounded-md bg-slate-100 focus:outline-none focus:ring-2 ${theme.inputFocusRing}`}
            />
          </div>
        ) : (
          <div className="relative flex items-center">
            <User className="absolute left-4 text-slate-700" size={20} />
            <input
              type="text"
              name='matricle'
              required
              placeholder={t("Enter Matricle or Username")}
              onChange={handleChange}
              className={`w-full pl-16 pr-4 py-4 text-xl text-indigo-800 font-semibold rounded-md bg-slate-100 focus:outline-none focus:ring-2 ${theme.inputFocusRing}`}
            />
          </div>
        )}

        <div className="relative flex items-center">
          <Lock className={`absolute left-4 ${parent ? "text-teal-700" : "text-indigo-700"} font-semibold`} size={20} />
          <input
            type="password"
            name='password'
            required
            placeholder={t("••••••••")}
            onChange={handleChange}
            className={`w-full pl-16 py-4 tracking-widest rounded-md ${parent ? "text-teal-800 bg-slate-100" : "text-indigo-800 bg-slate-100"} focus:outline-none focus:ring-2 ${theme.inputFocusRing}`}
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
          className={`flex gap-4 items-center justify-center w-full py-3 mt-4 rounded-xl font-semibold text-lg transition-all duration-200
            ${loading
              ? theme.buttonDisabledBg
              : theme.buttonBg + " " + theme.buttonTextColor
            }`}
        >
          <LogIn size={18} />
          {!loading ? parent ? t("Login As Parent") : t("Login") : t("Login In")}
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
};

export default LoginForm;
