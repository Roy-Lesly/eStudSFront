'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';


interface Props {
    href: string
}
const MyButtonAdd:FC<Props> = ({ href }) => {
    return (
      <button className='text-blue-500 bg-stroke'>
          <Link href={href} className='flex px-4 py-1 md:px-6 md:py-2'>
              Add
          </Link>
      </button>
    )
}

export default MyButtonAdd