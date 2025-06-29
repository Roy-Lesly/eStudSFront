// "use client";
import React, { useState } from 'react'

const MyButtonLoading = ({ title }: any) => {

    const [ isLoading, setIsLoading ] = useState(true);

    if (isLoading){
        return <div className='flex w-full items-center justify-center'>
            <div className="animate-spin border-6 border-bluedash border-solid border-t-transparent flex h-[34px] items-center justify-center rounded-full w-[34px]">.</div>
        </div>
    } else {
        return (
            <button 
                type='submit' 
                className='bg-green-600 font-semibold px-6 py-2 rounded text-lg text-white tracking-wide' 
                onClick={() => setIsLoading(true)}
            >
                    {title}
            </button>
        )
    }

}

export default MyButtonLoading