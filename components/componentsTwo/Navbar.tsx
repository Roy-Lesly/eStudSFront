import Image from "next/image"

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <div className='gap-2 hidden items-center md:flex px-2 ring-[1.5px] ring-gray-300 rounded-full text-xs'>
        <Image src="/icons/search.png" alt="" width={14} height={14}/>
        <input type="text" placeholder="Search..." className="bg-transparent outline-none p-2 w-[200px]"/>
      </div>
      {/* ICONS AND USER */}
      <div className='flex gap-6 items-center justify-end w-full'>
        <div className='bg-white cursor-pointer flex h-7 items-center justify-center rounded-full w-7'>
          <Image src="/message.png" alt="" width={20} height={20}/>
        </div>
        <div className='bg-white cursor-pointer flex h-7 items-center justify-center relative rounded-full w-7'>
          <Image src="/announcement.png" alt="" width={20} height={20}/>
          <div className='-right-3 -top-3 absolute bg-purple-500 flex h-5 items-center justify-center rounded-full text-white text-xs w-5'>1</div>
        </div>
        <div className='flex flex-col'>
          <span className="font-medium leading-3 text-xs">John Doe</span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/>
      </div>
    </div>
  )
}

export default Navbar