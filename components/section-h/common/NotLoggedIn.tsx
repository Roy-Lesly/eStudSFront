import Link from 'next/link'
import React from 'react'

const NotLoggedIn = () => {
  return (
    <div className='bg-slate-300 flex flex-col gap-10 h-screen items-center justify-center text-center tracking-widest w-full'>
        <div className='flex font-bold text-4xl'>Not Logged In</div>
        <div className='flex text-xl'>
            <Link 
                href={"/pageAuthentication/Login"}
                className='bg-slate-500 cursor-pointer hover:bg-slate-700 hover:text-blue-300 px-10 py-2 rounded text-black'
            >
                Login Again
            </Link>
        </div>
    </div>
  )
}

export default NotLoggedIn