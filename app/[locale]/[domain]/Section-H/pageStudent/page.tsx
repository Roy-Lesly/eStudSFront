'use client';
import { capitalizeFirstLetter, getData } from '@/functions';
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { GetUserProfileInter } from '@/Domain/Utils-H/userControl/userInter';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaPowerOff } from 'react-icons/fa6';
import { protocol } from '@/config';
import { JwtPayload } from '@/serverActions/interfaces';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/LanguageSwitcher';

const SelectDept = () => {

  const { t } = useTranslation("common");
  const params = useParams();
  const dom = useParams().domain;
  const [count, setCount] = useState<number>(0)
  const [myProfiles, setMyProfiles] = useState<GetUserProfileInter[]>();

  const router = useRouter();

  useEffect(() => {
    if (count == 0) {
      var session = localStorage.getItem("session");
      if (session) {
        var token: JwtPayload = jwtDecode(session)

        if (token && token.school) {
          const callUserProfiles = async () => {
            var res = await getData(protocol + "api" + dom + GetUserProfileUrl, { user_id: token.user_id, role: "student", active: true, nospecialty: false, }, Array.isArray(dom) ? dom[0] : dom)
            if (res && res.unauthorized) {
              router.push(`/pageAuthentication/Login`);
            }
            if (res && res.results) {
              setMyProfiles(res.results)
            }
          }
          callUserProfiles();
          setCount(1);
        }
      } else {
        router.push(`/pageAuthentication/Login`)
      }
    }
    if (count == 1) {

    }
  }, [count, router, dom])

  return (
    <>
      <div className='flex flex-col gap-4 h-screen items-center justify-center'>

        <div className='flex flex-col font-semibold gap-10 items-center justify-center mb-4 md:mb-6 text-4xl text-center'>
          <Link href={"/pageAuthentication/Logout"}><FaPowerOff color="red"/></Link>
          <LanguageSwitcher currentLocale={Array.isArray(params.locale) ? params.locale[0] : params.locale} />
          </div>

        <div className='font-semibold items-center justify-center md:mb-4 md:text-4xl text-center text-xl'>{t("PageStudent.select.Select Class")}</div>

        <div className='bg-white px-6 rounded'>
          {myProfiles && myProfiles.length > 0 ?
            <div className='flex flex-col gap-4 lg:flex-cols-1 md:gap-6'>
              {myProfiles.map((item: GetUserProfileInter) => (
              <Link href={`/${params.domain}/Section-H/pageStudent/${item.id}/${item.specialty_id}`} key={item.id} className='rounded bg-blue-950 border-2 cursor-pointer dark:hover:bg-teal-300 dark:hover:text-black dark:text-teal-100 flex font-bold h-32 hover:animate-ping-once items-center justify-center lg:h-40 lg:w-[300px] md:h-40 md:text-2xl md:w-56 rounded text-lg text-white tracking-widest w-60'>
                <div onClick={() => { localStorage.setItem("profile", item.id.toString()) }} className='flex flex-col items-center justify-center'>
                  <span className='md:px-6 px-4 text-center text-wrap text-xl'>{item.specialty_name}</span>
                  <span className='md:text-xl'>{item.academic_year}</span>
                  <span className='md:text-xl'>{item.level}</span>
                </div>
              </Link>
            ))}
            </div>

            :

            <div className='flex flex-col font-medium gap-4 justify-center text-center text-lg tracking-wide w-full'>
              <div className='flex items-center justify-center text-center text-red'>{t("PageStudent.select.No Class Assigned")} !!!</div>
              <div className='flex items-center justify-center text-center'><code>{t("PageStudent.select.Contact Administration")}</code></div>
            </div>

          }
        </div>

          <div className="my-10">
            <button onClick={() => { router.back() }} className='bg-greendark font-medium px-6 py-1 rounded text-lg text-white'>{t("PageStudent.select.Back")}</button>
          </div>

      </div>

    </>
  )
}

export default SelectDept