import Image from 'next/image'
import React from 'react'

const NoDataPage = () => {
  return (
    <div className='flex items-center justify-center p-10 rounded w-full'>
        <Image
            src="/icons/nodata.jpeg"
            alt="No Page Image"
            height={300}
            width={450}
            />
    </div>
  )
}

export default NoDataPage