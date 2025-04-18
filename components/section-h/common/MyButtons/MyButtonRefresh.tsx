import Link from 'next/link'
import React, { FC } from 'react'
import { FiRefreshCcw } from 'react-icons/fi'

interface RefreshProps {
    href: string
}
const MyButtonRefresh:FC<RefreshProps> = ({ href }: any) => {
  return (
    <Link href={href} className='bg-blue-100 flex gap-2 items-center justify-center px-2 py-1 rounded'>Refresh <FiRefreshCcw /></Link>
  )
}

export default MyButtonRefresh