'use client';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Cookies from 'js-cookie';
import LanguageSwitcher from '@/LanguageSwitcher';
import { useTranslation } from "react-i18next";
import { EdgeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql';
import { JwtPayload } from '@/serverActions/interfaces';
import { gql, useMutation } from '@apollo/client';
import { errorLog } from '@/utils/graphql/GetAppolloClient';


const LoginForm = ({ params, schools }: { schools: EdgeSchoolHigherInfo[], params: any }) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [count, setCount] = useState<number>(0);
  const [loginSucess, setLoginSucess] = useState<boolean>(false);
  const [access, setAccess] = useState<string>('');
  const [refresh, setRefresh] = useState<string>('');

  const [formData, setFormData] = useState({
    matricle: "",
    password: "",
    parent: false,
  });

  useEffect(() => {
    const session = localStorage.getItem('token');
    const school = localStorage.getItem('school');
    const token: JwtPayload | null = session && session.length ? jwtDecode(session) : null

    const handleSession = () => {
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
        if (token && token?.school?.length) {
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
      if (token && token?.school && token.school?.length == 1) {
        if (token.role?.toLowerCase() == "student") {
          router.push(`/${params.domain}/Section-H/pageStudent/?user=${token.user_id}`);
          return
        }
      }

      if (token?.school && token.school.length > 0) {
        if (token.role?.toLowerCase() == "admin" || token.role?.toLowerCase() == "teacher") {
          if (token.role == "admin") {
            if (token.dept || token.dept.length > 0) {
              router.push(`${token?.language ? "/" + token?.language[0] : ""}/${params.domain}/pageAuthentication/pageSelectSchool?role=${token.role}`);
              return;
            } else {
              Swal.fire({
                title: `${t("NoDepartmentAssignedToUser")}`,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                icon: 'warning',
              });
              return;
            }
          }
          if (token.role?.toLowerCase() == "teacher") {
            if (token.dept || token.dept.length > 0) {
              router.push(`/${params.domain}/pageAuthentication/pageSelectSchool?role=${token.role}`);
              return;
            }
          }
        }
        if (token.role?.toLowerCase() == "student") {
          router.push(`/Section-H/pageStudent/`);
        }
      }
      setCount(6);
    };

    if (count === 0) handleSession();
    if (count === 3) fetchSchools();
    if (count === 4 && token && refresh) handleSuccessfulLogin();
    if (count === 5 && token && refresh) redirectNextPage();
  }, [count, access, refresh, params.domain, schools, router, t]);

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await login({ variables: formData });
      const token = data.login.token;
      const refresh = data.login.refresh;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem('ref', refresh);
        Cookies.set('token', token, { expires: 1, secure: true });
        Cookies.set('refresh', refresh, { expires: 1, secure: true });

        setAccess(access);
        setRefresh(refresh);
        setLoginSucess(true);
        setCount(3);
      }
      else {
        localStorage.removeItem("token");
        console.log("ddddd");
      }
    } catch (err: any) {
      errorLog(err);
    }
  };

return (
  <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-600 to-purple-950 p-4">
    <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-6 py-8 md:px-10 md:py-12 transition-all duration-300 hover:shadow-indigo-500/40">
      
      <div className="flex justify-center mb-6">
        <LanguageSwitcher currentLocale={params.locale} />
      </div>

      {!loginSucess && (
        <>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-6">
            {t("Welcome Back")}
          </h2>

          <form method="post" onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="matricle" className="block mb-1 text-lg font-semibold text-gray-700">
                {t("Matricle")} {t("or")} {t("Username")}
              </label>
              <input
                type="text"
                name="matricle"
                id="matricle"
                required
                placeholder={t("Enter Matricle or Username")}
                onChange={handleChange}
                className="w-full px-5 py-3 text-xl font-semibold text-teal-800 tracking-wider border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-lg font-semibold text-gray-700">
                {t("Password")}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-5 py-3 text-xl tracking-widest text-teal-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              />
            </div>

            <div className="flex font-semibold justify-between text-sm text-indigo-600 mt-4">
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
              className={`w-full py-3 mt-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
                loading
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? `${t("Login In")} ...` : `${t("Login")}`}
            </button>
          </form>

          <div className="mt-8 border-t pt-4 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3 font-medium">
            <a
              href="https://wa.me/237693358642?text=Hi%20there,%20I%20need%20support!"
              className="hover:underline text-indigo-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Contact Support")}
            </a>

            <Link href={`/${params.domain}/pageAuthentication/CheckUser`} className="hover:underline text-indigo-600">
              {t("Check User")}
            </Link>
          </div>
        </>
      )}
    </div>
  </section>
);

};

export default LoginForm;


const LOGIN_MUTATION = gql`
  mutation Login(
    $matricle: String!,
    $password: String!
    $parent: Boolean!
  ) {
      login (
        matricle: $matricle,
        password: $password
        parent: $parent
      ) {
        token refresh
      }
    }
`;
// const LOGIN_MUTATION = gql`
//   mutation Login(
//     $matricle: String!,
//     $password: String!
//     $parent: Boolean!
//   ) {
//       token(
//         matricle: $matricle,
//         password: $password,
//         parent: $parent
//       ) {
//         token refresh
//       }
//     }
// `;