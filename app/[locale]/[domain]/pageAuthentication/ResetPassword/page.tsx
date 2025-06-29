'use client';
import React, {useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { ActionResetPassword } from '@/serverActions/AuthActions';
import Swal from 'sweetalert2';
import { protocol } from '@/config';
import { ResetPasswordEmail } from '@/Domain/configDom';
import Link from 'next/link';


const page = async ({
  params,
}: {
    params: any;
    searchParams?: any;
}) => {
  const p = await params;

  return (
    <CheckUserForm params={p} />
  )
}

export default page;


const CheckUserForm = ({ params }: any) => {
  const [attempts, setAttempts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();


  const onSubmitServerAction = async (prevState: any, formData: FormData) => {
    setLoading(true);
    var email = formData.get("email")
    const data = {
      email: email?.toString().toLowerCase(),
    }
    const response = await ActionResetPassword(data, protocol + "api" + params.domain + ResetPasswordEmail)
    console.log(34, response)
    if (response?.errors) { Swal.fire(response.errors); setLoading(false); }
    if (response?.error) { 
      if (JSON.stringify(response.error).includes("(535, b'Incorrect authentication data')")){
        setLoading(false);
        Swal.fire("An Error Occured")
        router.push(`/pageAuthentication/ResetPassword?error=An Error Occured`) 
      }    }
    if (response?.email) { 
      if (JSON.stringify(response.email).includes("We couldn't find an account associated with that email")){
        Swal.fire("No account associated with this email")
        router.push(`/pageAuthentication/ResetPassword?error=No account associated with that email`) 
      }
    }
    if (response?.status == "OK") { 
      Swal.fire("Check Your Email for The Token")
      router.push(`/${params.domain}/pageAuthentication/PasswordAndToken`) 
    }    
    setLoading(false)
  }

  const [errorState, submitAction] = useFormState(onSubmitServerAction, undefined)

  return (
    <section className="bg-boxdark dark:bg-gray-100">
      <div className="flex flex-col h-screen items-center justify-center lg:py-0 md:h-screen mx-auto px-6 py-8">
        <a href="#" className="flex font-semibold items-center mb-6 md:text-4xl text-3xl text-center text-white text-wrap tracking-widest">
          FORGOT PASSWORD REQUEST
        </a>

        <div className='mb-4 text-center text-slate-300 text-wrap'>
          <span>To Reset Password Enter Email Of The Account To Be Reset</span>
        </div>

        {errorState ? <div className='flex flex-col font-semibold italic items-center mb-2 sm:tracking-widest text-center text-md tracking-wide'><span className="text-red">{errorState}</span><span>(Attempts {attempts})</span></div> : <span></span>}

        <div className="bg-gray dark:bg-gray-800 dark:border dark:border-gray-700 md:mt-0 rounded-lg shadow sm:max-w-md w-full xl:p-0">
          <div className="flex flex-col p-6 sm:p-8">

            <form className="flex flex-col gap-10" action={submitAction}>

              <div className='mt-4'>
                <label htmlFor="email" className="block font-medium mb-2 md:text-xl text-black">EMAIL</label>
                <input type="email" name="email" id="email" className="bg-gray-50 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-black focus:border-primary-600 focus:ring-primary-600 p-2.5 rounded-lg sm:text-sm text-gray-900 w-full" placeholder="Email" required={true} />
              </div>

              <button
                type="submit"
                className="bg-primary bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 mb-10 md:text-lg px-5 py-2.5 rounded text-center text-white tracking-widest w-full"
                disabled={loading}
              >
                Submit
              </button>

            </form>

            <div className="flex items-center justify-between">
              <Link href={`/${params.domain}/pageAuthentication/Login`} className="bg-white dark:text-primary-500 font-medium hover:underline px-3 py-1 rounded text-primary-600 text-sm">Back To Login</Link>
              <Link href={`/${params.domain}/pageAuthentication/PasswordAndToken`} className="bg-white dark:text-primary-500 font-medium hover:underline px-3 py-1 rounded text-primary-600 text-sm">Enter Token</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}