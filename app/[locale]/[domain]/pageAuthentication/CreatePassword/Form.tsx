'use client';
import React, {FC, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { ActionCreatePassword } from '@/serverActions/AuthActions';
import { CreatePasswordUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { protocol } from '@/config';
import Link from 'next/link';


interface Props {
  searchParams: any
  params: any
}
const CreatePasswordForm:FC<Props> = ({ searchParams, params }) => {


  return (
    <CheckUserForm id={searchParams.id} params={params} username={searchParams.username} />
  )
}

export default CreatePasswordForm;


const CheckUserForm = ({ id, username, params } :any ) => {
  const [attempts, setAttempts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();


  const onSubmitServerAction = async (prevState: any, formData: FormData) => {
    setLoading(true);
    const data = {
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
    }
    const response = await ActionCreatePassword(data, id, protocol + "api" + params.domain + CreatePasswordUrl)
    if (response?.errors) { toast.error(response.errors); setAttempts(attempts + 1); setLoading(false); }
    if (response?.error) { toast.success("Password Created"); router.push(`/pageAuthentication/Login`) }
    if (response?.fail) { toast.success("User Found Set Password"); router.push(`/pageAuthentication/CreatePassword?id=${JSON.stringify(response.fail)}`) }
    if (response?.id) { toast.success("User Has Password"); router.push("/pageAuthentication/Login") }
    if (response?.success) { toast.success("Password Created"); router.push("/pageAuthentication/Login") }
    setLoading(false)
  }

  const [errorState, submitAction] = useFormState(onSubmitServerAction, undefined)

  return (
    <section className="bg-boxdark dark:bg-gray-100">
      <div className="flex flex-col h-screen items-center justify-center lg:py-0 md:h-screen mx-auto px-6 py-8">
        <span className="flex font-semibold items-center mb-6 md:text-4xl text-3xl text-white tracking-widest">
          CREATE PASSWORD
        </span>
        <span className="flex font-semibold items-center mb-6 md:text-4xl text-3xl text-blue-500 tracking-widest">
          {username}
        </span>

        {errorState ? <div className='flex flex-col font-semibold italic items-center mb-2 sm:tracking-widest text-center text-md tracking-wide'><span className="text-red">{errorState}</span><span>(Attempts {attempts})</span></div> : <span></span>}

        <div className="bg-gray dark:bg-gray-800 dark:border dark:border-gray-700 md:mt-0 rounded-lg shadow sm:max-w-md w-full xl:p-0">
          <div className="flex flex-col p-6 sm:p-8">

            <form className="flex flex-col gap-10" action={submitAction}>

              <div className='mt-4'>
                <label htmlFor="password" className="block font-medium mb-2 md:text-xl text-black">Password</label>
                <input type="password" name="password" id="password" className="bg-gray-50 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-black focus:border-primary-600 focus:ring-primary-600 p-2.5 rounded-lg sm:text-sm text-gray-900 w-full" placeholder="password" required={true} />
              </div>

              <div className='mt-4'>
                <label htmlFor="confirm_password" className="block font-medium mb-2 md:text-xl text-black">Confirm Password</label>
                <input type="password" name="confirm_password" id="confirm_password" className="bg-gray-50 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-black focus:border-primary-600 focus:ring-primary-600 p-2.5 rounded-lg sm:text-sm text-gray-900 w-full" placeholder="confirm password" required={true} />
              </div>

              <button
                type="submit"
                className="bg-primary bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 mb-10 md:text-lg px-5 py-2.5 rounded text-center text-white tracking-widest w-full"
                disabled={loading}
              >
                CREATE
              </button>

            </form>

            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="dark:text-gray-300 text-gray-500">Help</label>
                </div>
              </div>
              <Link 
              href="/pageAuthentication/Login" className="dark:text-primary-500 font-medium hover:underline text-primary-600 text-sm">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}