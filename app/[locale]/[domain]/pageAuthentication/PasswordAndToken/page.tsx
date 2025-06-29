'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { ActionConfirmResetPassword } from '@/serverActions/AuthActions';
import { ResetPasswordConfirmUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { ConfigData, protocol } from '@/config';

const ResetPasswordPage = ({
  params,
}: {
    params: any;
}) => {
  const p = params;

  return <CheckUserForm params={p} />;
};

export default ResetPasswordPage;

const CheckUserForm = ({ params }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmitServerAction = async (formData: FormData) => {
    const password = formData.get('password');
    const confirm_password = formData.get('confirm_password');

    if (password !== confirm_password) {
      Swal.fire({
        title: 'Passwords do not match!',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    setLoading(true);

    const data = {
      token: formData.get('token'),
      password,
      confirm_password,
    };

    const response = await ActionConfirmResetPassword(
      data,
      `${protocol}api${params.domain}${ResetPasswordConfirmUrl}`
    );

    if (response?.status === 'OK') {
      Swal.fire({
        title: 'Password Reset Successfully!',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
      });
      router.push('/pageAuthentication/Login');
    } else {
      Swal.fire({
        title: response?.error || 'Something went wrong!',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
      });
    }

    setLoading(false);
  };

  return (
    <section className="bg-gradient-to-br flex from-blue-900 items-center justify-center min-h-screen p-4 to-black via-gray-900">
      <div
        className="animate-slide-in bg-white dark:bg-gray-800 max-w-md p-6 rounded-lg shadow-lg w-full"
        role="dialog"
        aria-labelledby="reset-password-title"
        aria-describedby="reset-password-description"
      >
        <h2
          id="reset-password-title"
          className="dark:text-white font-bold mb-4 text-2xl text-center text-gray-800"
        >
          Reset Password
        </h2>
        <p
          id="reset-password-description"
          className="dark:text-gray-400 mb-6 text-center text-gray-600 text-sm"
        >
          Enter the token and your new password below.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmitServerAction(formData);
          }}
          className="space-y-6"
        >
          {/* Token Field */}
          <div className="relative">
            <label
              htmlFor="token"
              className="block dark:text-gray-300 font-medium text-gray-700 text-sm"
            >
              Token
            </label>
            <input
              type="text"
              id="token"
              name="token"
              required
              className="bg-gray-50 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400 dark:placeholder-gray-500 dark:text-white focus:border-blue-500 focus:ring-blue-500 mt-1 placeholder-gray-400 px-4 py-2 rounded-lg text-gray-800 w-full"
              placeholder="Enter your token"
            />
          </div>

          {/* New Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block dark:text-gray-300 font-medium text-gray-700 text-sm"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={8}
              className="bg-gray-50 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400 dark:placeholder-gray-500 dark:text-white focus:border-blue-500 focus:ring-blue-500 mt-1 placeholder-gray-400 px-4 py-2 rounded-lg text-gray-800 w-full"
              placeholder="Enter new password"
              aria-describedby="password-instructions"
            />
            <p
              id="password-instructions"
              className="dark:text-gray-400 mt-1 text-gray-500 text-xs"
            >
              Must be at least 8 characters, with an uppercase, lowercase, and a
              number.
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label
              htmlFor="confirm_password"
              className="block dark:text-gray-300 font-medium text-gray-700 text-sm"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              required
              className="bg-gray-50 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400 dark:placeholder-gray-500 dark:text-white focus:border-blue-500 focus:ring-blue-500 mt-1 placeholder-gray-400 px-4 py-2 rounded-lg text-gray-800 w-full"
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
            }`}
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4">
          <a
            href={`https://wa.me/+237${ConfigData[params.domain].contact_number}/?text=Need%20help%20with%20password%20reset`}
            className="dark:text-blue-400 font-medium hover:underline text-blue-600 text-sm"
          >
            Need Help?
          </a>
          <a
            href={`/${params.domain}/pageAuthentication/Login`}
            className="dark:text-blue-400 font-medium hover:underline text-blue-600 text-sm"
          >
            Back to Login
          </a>
        </div>
      </div>
    </section>
  );
};
