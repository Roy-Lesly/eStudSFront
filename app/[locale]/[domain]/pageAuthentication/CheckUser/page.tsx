'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ActionCheckUser } from '@/serverActions/AuthActions';
import { CheckPasswordUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { protocol } from '@/config';

const CheckUser = () => {
  return <CheckUserForm />;
};

export default CheckUser;

const CheckUserForm = () => {
  const router = useRouter();
  const domain = useParams().domain;

  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  const onSubmitServerAction = async (prevState: any, formData: FormData) => {
    setLoading(true);
    const data = { matricle: formData.get('username') };

    const response = await ActionCheckUser(data, `${protocol}api${domain}${CheckPasswordUrl}`);

    if (response?.errors) {
      toast.error(response.errors);
      setAttempts(attempts + 1);
    } else if (response?.fail) {
      toast.success('Set Password');
      router.push(`/${domain}/pageAuthentication/CreatePassword?id=${response.fail.id}&username=${response.fail.username}`);
    } else if (response?.id) {
      toast.success('Has Password');
      router.push('/pageAuthentication/Login');
    }

    setLoading(false);
  };

  const [errorState, submitAction] = useFormState(onSubmitServerAction, undefined);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white dark:bg-gray-800 max-w-md p-8 rounded-lg shadow-lg w-full">
        <h1 className="dark:text-white font-bold mb-6 text-3xl text-center text-gray-900 tracking-wider">
          CHECK USER
        </h1>

        {errorState ? (
          <div className="dark:text-red-400 mb-4 text-center text-red-600">
            <p className="font-semibold italic">{errorState}</p>
            <p>(Attempts: {attempts})</p>
          </div>
        ) : null}

        <form className="space-y-6" action={submitAction}>
          <div>
            <label
              htmlFor="username"
              className="block dark:text-gray-300 font-medium mb-2 text-gray-700 text-sm"
            >
              Matricle or Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter matricle or username"
              className="bg-gray-50 border dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-lg text-gray-900 w-full"
              required
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-semibold hover:bg-blue-700 py-2.5 rounded-lg text-white w-full"
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? 'Checking...' : 'Check'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/pageAuthentication/Login" className="dark:text-blue-400 hover:underline text-blue-600">
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};
