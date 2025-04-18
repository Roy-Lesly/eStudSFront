import React from 'react'

const MyLoadingModal = () => {
    return (
        <div className="flex items-center justify-center">
            <span className={`flex animate-spin border-6 border-solid border-t-transparent h-[34px]  rounded-full w-[34px]`}>.</span>
        </div>
    )
}

export default MyLoadingModal