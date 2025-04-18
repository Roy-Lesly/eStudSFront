
"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";


interface SearchProps {
  placeholder: string
  searchString: string
}
const TableSearch:FC<SearchProps> = ({ searchString, placeholder }) => {

  const router = useRouter()
  const pathname = usePathname()
  const search = async (formData: any) => {
    var name = formData.get("t")
    var s = `${pathname}?${searchString}=${name}`

    if (s.length){
      router.push(s)
      return
    }
    router.push(pathname)
  }

  return (
    <form action={search} className="bg-white flex gap-2 items-center md:w-full px-2 ring-[1.5px] ring-gray-300 rounded-lg w-full">
      <input
        name="t"
        type="text"
        placeholder={`${placeholder}...`}
        className="bg-transparent outline-none p-1 w-full"
      />
      <button type="submit"><Image src="/icons/search.png" alt="" width={14} height={14} /></button>
    </form>
  );
};

export default TableSearch;
