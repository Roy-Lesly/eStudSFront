'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHourglassEnd } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { gql, useMutation } from '@apollo/client';
import { errorLog } from '@/utils/graphql/GetAppolloClient';

const SessionExpired = () => {
    const { t } = useTranslation();
    const [showLogin, setShowLogin] = useState<boolean>(false)

    const [formData, setFormData] = useState({
        matricle: "",
        password: "",
        parent: false,
    });

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
            console.log(data);
            const token = data.login.token;
            const refresh = data.login.refresh;

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem('ref', refresh);
                Cookies.set('token', token, { expires: 1, secure: true });
                Cookies.set('refresh', refresh, { expires: 1, secure: true });
                window.location.reload();
            }
            else {
                localStorage.removeItem("token");
            }
        } catch (err: any) {
            errorLog(err)
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-black bg-opacity-60 flex inset-0 items-center justify-center md:py-40 z-50"
        >
            {showLogin ? <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-white dark:bg-gray-900 flex flex-col gap-4 items-center justify-center max-w-sm p-8 rounded-2xl shadow-2xl text-center w-full"
            >
                <h1 className="dark:text-white font-extrabold text-2xl text-slate-800">
                    {t("Login")}
                </h1>

                <form
                    className="space-y-6"
                    onSubmit={handleLogin}
                >
                    <div className="space-y-1">
                        <label htmlFor="matricle" className="block font-medium text-gray-700 text-sm">
                            {t("Matricle")} {t("or")} {t("Username")}
                        </label>
                        <input
                            type="text"
                            name="matricle"
                            id="matricle"
                            required
                            placeholder="Enter your Matricle"
                            onChange={handleChange}
                            className="border focus:ring focus:ring-indigo-300 px-4 py-2 rounded-lg text-gray-700 w-full"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block font-medium text-gray-700 text-sm">
                            {t("Password")}
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            placeholder="••••••••"
                            onChange={handleChange}
                            className="border focus:ring focus:ring-indigo-300 px-4 py-2 rounded-lg text-gray-700 w-full"
                        />
                    </div>


                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        type='submit'
                        className="bg-blue-600 duration-300 flex font-semibold gap-2 hover:bg-blue-700 items-center justify-center mt-6 px-6 py-2 rounded-lg shadow-md text-white transition w-full"
                    >
                        {loading ? `${t("Login in")}...` : `${t("Login")}`}
                    </motion.button>
                </form>


            </motion.div>


                :


                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="bg-white dark:bg-gray-900 flex flex-col gap-4 items-center justify-center max-w-sm p-8 rounded-2xl shadow-2xl text-center w-full"
                >
                    <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <FaHourglassEnd className="mb-4 text-6xl text-red-500" />
                    </motion.div>
                    <h1 className="dark:text-white font-extrabold text-2xl text-gray-800">
                        {t("Session Expired")}
                    </h1>
                    <p className="dark:text-gray-300 text-base text-gray-600">
                        {t("Your session has timed out due to inactivity")}.
                    </p>
                    <p className="dark:text-gray-300 text-gray-600 text">
                        {t("Please log in again to continue using the application")}.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLogin(true)}
                        className="bg-blue-600 duration-300 flex font-semibold gap-2 hover:bg-blue-700 items-center px-6 py-2 rounded-lg shadow-md text-white transition"
                    >
                        <IoReload className="text-lg" />
                        {t("Re-login")}
                    </motion.button>
                </motion.div>

            }
        </motion.div>
    );
};

export default SessionExpired;


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