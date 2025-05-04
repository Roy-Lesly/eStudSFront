'use client';
import { protocol } from '@/config';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { ActionLogin } from '@/serverActions/AuthActions';
import { LoginUrl } from '@/Domain/configDom';
import Link from 'next/link';
import Cookies from 'js-cookie';
import LanguageSwitcher from '@/LanguageSwitcher';
import { useTranslation } from "react-i18next";
import { EdgeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql';
import { JwtPayload } from '@/serverActions/interfaces';


const LoginForm = ({ params, schools }: { schools: EdgeSchoolHigherInfo[], params: any }) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginSucess, setLoginSucess] = useState<boolean>(false);
  const [access, setAccess] = useState<string>('');
  const [refresh, setRefresh] = useState<string>('');

  useEffect(() => {
    const handleSession = () => {
      const session = localStorage.getItem('session');
      const school = localStorage.getItem('school');

      if (session) {
        const token: JwtPayload | any = jwtDecode(session);
        if (token) {
          const isTokenExpired =
            new Date().toISOString() >
            new Date((token.exp || 1) * 1000).toISOString();
          if (isTokenExpired) {
            localStorage.clear();
          } else if (school) {
            // router.push(`/pageAuthentication/pageSelectSchool`);
          }
        } else {
          localStorage.clear();
        }
      }
    };

    const fetchSchools = async () => {
      if (schools?.length) {
        const tok: JwtPayload = jwtDecode(access)
        if (tok && tok?.school?.length) {
          setCount(4);
        } else {
          Swal.fire({
            title: `${t("NoCampusAssignedToUser")}`,
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: 'warning',
          });
        }
      } else {
        Swal.fire({
          title: `${t("NoCampusFoundInDatabase")}`,
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
          icon: 'warning',
        });
      }
    };

    const handleSuccessfulLogin = () => {
      Swal.fire({
        title: `${t("Login Successfully")}`,
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        icon: 'success',
      });
      setCount(5);
    };

    const redirectNextPage = () => {
      const token: JwtPayload | any = jwtDecode(access)
      console.log(token.school.length, 87)

      if (token && token.school && token.school.length == 1) {
        if (token.role == "student") {
          router.push(`/${params.domain}/Section-H/pageStudent`);
          return
        }
      }

      if (token.school && token.school.length > 0) {
        if (token.role == "admin" || token.role == "teacher") {
          if (token.role == "admin") {
            if (token.dept || token.dept.length > 0) {
              router.push(`/${params.domain}/pageAuthentication/pageSelectSchool?role=${token.role}`);
              return;
            }
          }
          if (token.role == "teacher") {
            if (token.dept || token.dept.length > 0) {
              router.push(`/${params.domain}/pageAuthentication/pageSelectSchool?role=${token.role}`);
              return;
            }
          }
        }
        if (token.role == "student") {
          router.push(`/Section-H/pageStudent/`);
        }
      }
      setCount(6);
    };

    if (count === 0) handleSession();
    if (count === 3) fetchSchools();
    if (count === 4 && access && refresh) handleSuccessfulLogin();
    if (count === 5 && access && refresh) redirectNextPage();
  }, [count, access, refresh, params.domain]);

  const onSubmitServerAction = async (prevState: any, formData: FormData) => {
    setLoading(true);
    const data = {
      matricle: formData.get('username'),
      password: formData.get('password'),
    };

    const response = await ActionLogin(
      data,
      `${protocol}api${params.domain}${LoginUrl}`
    );

    // console.log(response, 135)

    setLoading(false);

    if (response?.detail || response?.error) {
      Swal.fire({
        title: response.detail || response.error,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        icon: response.error ? 'error' : 'warning',
      });
      return response.detail || response.error;
    }

    if (response?.access) {
      // Save tokens to cookies
      Cookies.set('token', response.access, { expires: 1, secure: true });
      Cookies.set('refresh', response.refresh, { expires: 1, secure: true });

      // Save to local storage (optional, for additional access)
      localStorage.setItem('session', response.access);
      localStorage.setItem('token', response.access);
      localStorage.setItem('ref', response.refresh);

      setAccess(response.access);
      setRefresh(response.refresh);
      setLoginSucess(true);
      setCount(3);
    }
  };

  return (
    <section className="bg-gradient-to-br flex flex-col from-blue-700 items-center p-2 md:p-4 justify-center min-h-screen to-indigo-950">
      
      <div className='flex justify-center mb-20'><LanguageSwitcher currentLocale={params.locale} /></div>


      {!loginSucess ? <div className="bg-white hover:scale-105 max-w-md p-4 md:p-6 rounded-xl shadow-lg transform transition w-full">
        <h2 className="font-bold mb-6 text-3xl text-center text-gray-800">
          {t("Welcome Back")}
        </h2>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmitServerAction(null, formData);
          }}
        >
          <div className="space-y-1">
            <label htmlFor="username" className="block font-medium text-gray-800">
              {t("Matricle")} {t("or")} {t("Username")}
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              placeholder={t("Enter Matricle or Username")}
              className="border focus:ring focus:ring-indigo-300 px-6 py-3 rounded-lg text-gray-900 text-lg sm:text-2xl font-semibold w-full"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block font-medium text-gray-700">
              {t("Password")}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="••••••••"
              className="border focus:ring focus:ring-indigo-300 px-4 py-2 rounded-lg tracking-widest text-xl text-gray-700 w-full"
            />
          </div>
          <div className="flex justify-between text-indigo-600">
            <a href="/pageAuthentication/ResetPassword" className="hover:underline">
              {t("Forgot Password")}?
            </a>
            <a href={`/${params.domain}/pageAuthentication/PasswordAndToken`} className="hover:underline">
              {t("Enter Token")}
            </a>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold tracking-wider text-xl ${loading
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 transition'
              }`}
            disabled={loading}
          >
            {loading ? `${t("Login In")} ...` : `${t("Login")}`}
          </button>
        </form>

        <div className="flex items-center justify-between text-indigo-600 mt-6 text-lg">
          <div className=" text-center text-gray-500">
            {/* Help?{' '} */}
            <a
              href="https://wa.me/237693358642?text=Hi%20there,%20I%20need%20support!"
              className="hover:underline text-indigo-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Contact Support")}
            </a>
          </div>

          <div className="text-center text-gray-500">
            <Link href={`/${params.domain}/pageAuthentication/CheckUser`}>{t("Check User")}</Link>
          </div>
        </div>
      </div>
        :
        null}
    </section>
  );
};

export default LoginForm;
