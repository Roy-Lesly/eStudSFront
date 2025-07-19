'use client';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { EdgeSchoolInfoHigher } from '@/Domain/schemas/interfaceGraphql';
import { JwtPayload } from '@/serverActions/interfaces';
import { gql } from '@apollo/client';
import BackGround from '../BackGround';
import LoginForm from './LoginForm';
import { ApiFactory } from '@/utils/graphql/ApiFactory';


const Display = ({ params, schools }: { schools: EdgeSchoolInfoHigher[], params: any }) => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [count, setCount] = useState<number>(0);
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
                        title: `${t("No Campus Assigned To User")}`,
                        timer: 5000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        icon: 'warning',
                    });
                    setLoading(false)
                }
            } else {
                Swal.fire({
                    title: `${t("No Campus Found In Database")}`,
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    icon: 'warning',
                });
                setLoading(false)
            }
        };

        const handleSuccessfulLogin = () => {
            console.log("object", 99);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const loginData = await ApiFactory({
            newData: formData,
            editData: {},
            mutationName: "login",
            modelName: "login",
            successField: "id",
            query: LOGIN_MUTATION,
            router,
            params,
            redirect: false,
            reload: false,
            returnResponseField: false,
            returnResponseObject: true,
            redirectPath: ``,
            actionLabel: "creating",
        });

        const token = loginData?.token;
        const refresh = loginData?.refresh;

        if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem('ref', refresh);
            Cookies.set('token', token, { expires: 1, secure: true });
            Cookies.set('refresh', refresh, { expires: 1, secure: true });

            setAccess(access);
            setRefresh(refresh);
            setCount(3);
        }
        else {
            localStorage.removeItem("token");
            setLoading(false)
        }
    };

    return (
        <BackGround bgColor="bg-black/90">
            {schools && schools.length > 0 ? (
                <LoginForm
                    params={params}
                    handleChange={handleChange}
                    loading={loading}
                    handleLogin={handleLogin}
                    school={schools[0]}
                />
            ) : (
                <div className="flex flex-col items-center justify-center gap-6 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl font-semibold text-red-500"
                    >
                        {t("Unable to Load Campus Information")}
                    </motion.div>

                    <ul className="text-lg md:text-xl space-y-2">
                        <li className="flex items-center gap-2">
                            <span>⚠️</span> {t("Check your internet connection")}
                        </li>
                        <li className="flex items-center gap-2">
                            <span>🏫</span> {t("No Campus Registered Yet")}
                        </li>
                        <li className="flex items-center gap-2">
                            <span>📞</span> {t("Contact Technical Support")}
                        </li>
                    </ul>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-md transition-all"
                    >
                        🔁 {t("Retry")}
                    </motion.button>
                </div>
            )}
        </BackGround>

    );

};

export default Display;


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