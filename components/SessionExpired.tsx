'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHourglassEnd } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import { ActionLogin } from '@/serverActions/AuthActions';
import { protocol } from '@/config';
import { LoginUrl } from '@/Domain/configDom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const SessionExpired = ({ domain }: { domain: string }) => {

    const [showLogin, setShowLogin] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmitServerAction = async (prevState: any, formData: FormData) => {
        setLoading(true);
        const data = {
            matricle: formData.get('username'),
            password: formData.get('password'),
        };

        const response = await ActionLogin(
            data,
            `${protocol}api${domain}${LoginUrl}`
        );

        if (response.detail) {
            Swal.fire({
                title: `${response.detail}`,
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
                icon: 'warning',
            });
        }
        if (response.refresh && response.access){
            Cookies.set('token', response.access, { expires: 7, secure: true });
            Cookies.set('refresh', response.refresh, { expires: 7, secure: true });
            localStorage.setItem('session', response.access);
            localStorage.setItem('token', response.access);
            localStorage.setItem('ref', response.refresh);
            window.location.reload();
        }

        setLoading(false);
    }
    
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
                    Login
                </h1>

                <form
                    className="space-y-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        onSubmitServerAction(null, formData);
                    }}
                >
                    <div className="space-y-1">
                        <label htmlFor="username" className="block font-medium text-gray-700 text-sm">
                            Matricle or Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            required
                            placeholder="Enter your Matricle"
                            className="border focus:ring focus:ring-indigo-300 px-4 py-2 rounded-lg text-gray-700 w-full"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block font-medium text-gray-700 text-sm">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            placeholder="••••••••"
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
                        {loading ? 'Logging in...' : 'Login'}
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
                        Session Expired
                    </h1>
                    <p className="dark:text-gray-300 text-base text-gray-600">
                        Your session has timed out due to inactivity.
                    </p>
                    <p className="dark:text-gray-300 text-gray-600 text-sm">
                        Please log in again to continue using the application.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLogin(true)}
                        className="bg-blue-600 duration-300 flex font-semibold gap-2 hover:bg-blue-700 items-center px-6 py-2 rounded-lg shadow-md text-white transition"
                    >
                        <IoReload className="text-lg" />
                        Re-login
                    </motion.button>
                </motion.div>

            }
        </motion.div>
    );
};

export default SessionExpired;
