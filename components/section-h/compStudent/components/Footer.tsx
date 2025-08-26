import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = async ({ params, feeInfo, source }: {params: any, feeInfo: EdgeSchoolFees, source: "H" | "S" | "P" }) => {

  const footerIcons = [
    { id: 1, link: "student", alt: "Home", url: "/images/home.png", },
    { id: 2, link: "settings", alt: "Settings", url: "/images/setting.svg", },
    { id: 3, link: "profile", alt: "MyProfile", url: "/images/profil.png", }
  ]

  const profileId = source === "H" ? params.userprofile_id : source === "S" ? params.userprofilesec_id : source === "P" ? params.userprofileprim_id : 0 
  const classId = source === "H" ? params.specialty_id : source === "S" ? params.specialty_id : source === "P" ? params.specialty_id : 0 

  return (
    <div className="bottom-0 fixed flex flex-col h-[62px] justify-between w-full">
      <span className="align-bottom flex flex-col italic items-center text-[11px] tracking-widest">
          Powered By Econneq
      </span>

      <nav className='bg-blue-900 flex items-center justify-between left-0 px-10 py-2 w-full'>
        {footerIcons.map((item) => {
          var link: string = ""
          if (item.link == "student") { link = `/${params.domain}/Section-${source}/pageStudent/${profileId}/${params.classId}` }
          if (item.link == "settings") { link = `/${params.domain}/Section-${source}/pageStudent/${profileId}/${params.classId}/Settings` }
          if (item.link == "profile") { link = `/${params.domain}/Section-${source}/pageStudent/${profileId}/${params.classId}/Profile` }
          return (
            <Link href={link} key={item.id} className='fg-black'>
              <Image key={item.alt} src={item.url} alt={item.alt} width={25} height={25} />
            </Link>
          )
        })}

      </nav>
    </div>

  )
}

export default Footer