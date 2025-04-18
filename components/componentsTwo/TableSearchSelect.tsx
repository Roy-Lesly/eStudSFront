
"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";


interface SearchProps {
  searchString: string
  data?: any[]
  objectData?: {}[]
  field?: string
}
const TableSearchSelect:FC<SearchProps> = ({ searchString, data, objectData, field }) => {

  const router = useRouter()
  const pathname = usePathname()
  const search = async (formData: any) => {
    var name = formData.get("t")
    var s = `${pathname}?${searchString}=${name}`

    if (s.length){
      router.push(s)
      return
    }
    router.push(pathname ? pathname : "undefined")
  }

  return (
    <form action={search} className="bg-white flex gap-2 items-center md:w-full px-2 ring-[1.5px] ring-gray-300 rounded-lg w-full">
      <select name="t" className="bg-transparent outline-none p-1 w-full">
        <option></option>
        {data && data.map((item: string | number) => <option key={item} value={item}>{item}</option>)}
        {objectData && field && objectData.map((item: any) => <option key={item[field]} value={item[field]}>{item[field]}</option>)}
      </select>
      <button type="submit"><Image src="/icons/search.png" alt="" width={14} height={14} /></button>
    </form>
  );
};

export default TableSearchSelect;
