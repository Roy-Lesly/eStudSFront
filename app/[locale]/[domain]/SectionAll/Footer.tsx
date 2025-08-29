import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = async (
  { params, section, role }:
  {params: any, section: "H" | "S" | "P", role: "Student" | "Parent" }
) => {

  const footerIcons = [
    { id: 1, link: "student", alt: "Home", url: "/images/home.png", },
    { id: 2, link: "settings", alt: "Settings", url: "/images/setting.svg", },
    { id: 3, link: "profile", alt: "MyProfile", url: "/images/profil.png", }
  ]

  const profileId = section === "H" ? params.userprofile_id : section === "S" ? params.userprofilesec_id : section === "P" ? params.userprofileprim_id : 0 
  const classId = section === "H" ? params.specialty_id : section === "S" ? params.classroomsec_id : section === "P" ? params.classroomprim_id : 0 

  return (
    <div className="bottom-0 fixed flex flex-col h-[62px] justify-between w-full">
      <span className="align-bottom flex flex-col italic items-center text-[11px] tracking-widest">
          Powered By Econneq
      </span>

      <nav className='bg-blue-900 flex items-center justify-between left-0 px-10 py-2 w-full'>
        {footerIcons.map((item) => {
          var link: string = ""
          if (item.link == "student") { link = `/${params.domain}/Section-${section}/page${role}/${profileId}/${classId}` }
          if (item.link == "settings") { link = `/${params.domain}/Section-${section}/page${role}/${profileId}/${classId}/Settings` }
          if (item.link == "profile") { link = `/${params.domain}/Section-${section}/page${role}/${profileId}/${classId}/Profile` }
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