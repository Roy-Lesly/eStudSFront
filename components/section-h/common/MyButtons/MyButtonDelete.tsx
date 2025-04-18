import Link from 'next/link'
import React, { FC } from 'react'


interface Props {
    href: string
}
const MyButtonDelete:FC<Props> = ({ href }) => {
  return (
    <button className='text-blue-500 bg-stroke'>
        <Link href={href} className='flex px-2 py-1 md:px-3 2xl:px-4 md:py-2'>
            Delete
        </Link>
    </button>
  )
}

export default MyButtonDelete