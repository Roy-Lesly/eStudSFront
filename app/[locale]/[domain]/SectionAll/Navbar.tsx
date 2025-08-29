import { NodeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql';
import Link from 'next/link';
import React from 'react';
import { FaPowerOff } from 'react-icons/fa6'

const Navbar = async (
  // { school, section, role }: 
  // { school: NodeSchoolHigherInfo, section: "H" | "S" | "P", role: "Student" | "Parent" }
  { school }: 
  { school: NodeSchoolHigherInfo }
) => {

  return (
    <nav className='bg-blue-900 fixed flex h-[64px] items-center justify-between left-0 px-6 py-2 top-0 w-full'>

      {school ? <div className='flex flex-col justify-between text-white'>
        <span className='font-semibold text-center tracking-widest'>{school?.schoolName}</span>
        <div className='flex font-medium gap-4 italic items-center justify-center text-sm'>
          <span className='flex'>{school?.region}</span>
          <span className='flex'>-</span>
          <span className='flex'>{school?.campus}</span>
        </div>
      </div> : null}

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