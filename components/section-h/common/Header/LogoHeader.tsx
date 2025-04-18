'use client';
import { ConfigData } from '@/config';
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React from 'react'


const LogoHeader = ({ trigger, sidebarOpen, setSidebarOpen, home }: any) => {

  const domain = useParams().domain
  return (
    <div className="flex gap-2 items-center justify-center mt-2">
      <Link href={home} className="hidden md:flex rounded-full">
        <Image
          width={100}
          height={100}
          src={domain ? ConfigData[`${domain}`]['higher'].logo512 : ConfigData["local"]['higher'].logo512 }
          alt="Logo"
          style={{ borderRadius: 50, backgroundColor: "white" }}
          priority
        />
      </Link>
      <Link href={home} className="flex flex-col items-center justify-center md:hidden rounded-full w-full">
        <Image
          width={70}
          height={70}
          src={domain ? ConfigData[`${domain}`]['higher'].logo256 : ConfigData["local"]['higher'].logo256 }
          alt="Logo"
          style={{ borderRadius: 50, backgroundColor: "white" }}
          priority
        />
      </Link>

      <button
        ref={trigger}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-controls="sidebar"
        aria-expanded={sidebarOpen}
        className="block lg:hidden px-6"
      >
        <svg
          className="fill-current"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
            fill=""
          />
        </svg>
      </button>
    </div>
  )
}

export default LogoHeader