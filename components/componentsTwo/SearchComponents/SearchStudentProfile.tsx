
"use client";
import { GetLevelInter } from "@/Domain/Utils-H/appControl/appInter";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";


interface SearchProps {
  apiYear: string[]
  apiLevel: GetLevelInter[]
}
const SearchStudentProfile:FC<SearchProps> = ({ apiYear, apiLevel }) => {

  const router = useRouter()
  const pathname = usePathname()
  const search = async (formData: any) => {
    var name = formData.get("name")
    var specialty = formData.get("specialty")
    var level = formData.get("level")
    var year = formData.get("year")

    const Fix: any | null = () => {
        var res: null | any = null
        if (name != null && name.length){ res = `fullName=${name}` }
        if (specialty != null && specialty.length){ res = res ? res + `&specialtyName=${specialty}` : `specialtyName=${specialty}` }
        if (level != null && level.length){ res = res ? res + `&level=${level}` : `level=${level}` }
        if (year != null && year.length){ res = res ? res + `&academicYear=${year}` : `academicYear=${year}` }
        return res
    }

    var r = (Fix())

    if (r && r.length > 5){
        router.push(`${pathname}?${r}`)
    } else {
        router.push(`${pathname}`)
    }
  }

  return (
    <form action={search} className="bg-white flex flex-col gap-2 items-center md:flex-row md:w-full px-2 w-full">
      <input
        name="name"
        type="text"
        placeholder={`Name...`}
        className="bg-transparent md:w-[50%] outline-none p-1 ring-[1.5px] ring-gray-300 rounded w-full"
      />
      <input
        name="specialty"
        type="text"
        placeholder={`Class...`}
        className="bg-transparent md:w-[35%] outline-none p-1 ring-[1.5px] ring-gray-300 rounded w-full"
      />
      <select
        name="level"
        className="bg-transparent md:w-[15%] outline-none p-1 ring-[1.5px] ring-gray-300 rounded w-full"
      >
        <option value={""}>--------------</option>
        {apiLevel.map((item: GetLevelInter) => <option key={item.id} value={item.level}>{item.level}</option>)}
      </select>
      <select
        name="year"
        className="bg-transparent md:w-[15%] outline-none p-1 ring-[1.5px] ring-gray-300 rounded w-full"
      >
        <option value={""}>--------------</option>
        {apiYear.map((item: string) => <option key={item} value={item}>{item}</option>)}
      </select>
      <button type="submit" className="border-2 p-2 rounded-full"><Image src="/icons/search.png" alt="" width={14} height={14} /></button>
    </form>
  );
};

export default SearchStudentProfile;
