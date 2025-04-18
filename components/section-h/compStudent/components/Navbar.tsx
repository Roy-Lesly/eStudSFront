import { EdgeSchoolFees, EdgeUserProfile } from '@/Domain/schemas/interfaceGraphql';
import Link from 'next/link';
import React from 'react';
import { FaPowerOff } from 'react-icons/fa6'

const Navbar = async ({ profileInfo, feeInfo }: { profileInfo: EdgeUserProfile, feeInfo: EdgeSchoolFees }) => {

  return (
    <nav className='bg-blue-900 fixed flex h-[64px] items-center justify-between left-0 px-6 py-2 top-0 w-full'>

      {profileInfo && <div className='flex flex-col justify-between text-white'>
        <span className='font-semibold text-center tracking-widest'>{profileInfo.node.specialty.school.schoolName}</span>
        <div className='flex font-medium gap-4 italic items-center justify-center text-sm'>
          <span className='flex'>{profileInfo.node.specialty.school.region}</span>
          <span className='flex'>-</span>
          <span className='flex'>{profileInfo.node.specialty.school.campus}</span>
        </div>
      </div>}

      <div className='flex items-center justify-center'>
        <span>
          {/* <DarkModeSwitcher /> */}
        </span>
        <span>
          <Link href={"/pageAuthentication/Logout"}><FaPowerOff color='red' size={25}/></Link>
        </span>
      </div>

    </nav>
  )
}

export default Navbar