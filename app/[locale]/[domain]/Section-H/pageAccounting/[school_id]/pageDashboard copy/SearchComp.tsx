import { redirect } from 'next/navigation';
import React from 'react';

const SearchComp = ({ p, sp, sortedAcadYears }: any) => {

  console.log(p, "search component");

  const LoadStatsByYear = async (formData: FormData) => {
    'use server'
    var academic_year = formData.get("academic_year")
    var period = formData.get("period")

    if (academic_year && academic_year.toString().length == 9 && period) {
      var one = academic_year.slice(0, 4)
      redirect(`/${p.domain}/Section-H/pageAccounting/${p.school_id}/pageDashboard?academic_year=${academic_year}&this_year=${one}&period=${period}`)
    }
    if (academic_year && academic_year.toString().length > 1) {
    }

  }

  return <div className="flex flex-col gap-2 items-center justify-between md:flex-row rounded text-black">
    {sp && sp.period == "ac_year" ?
      <div className="bg-white flex gap-2 items-center px-4 py-1 rounded"><span className="font-semibold text-lg tracking-widest">Academic Year :</span><span>{sp.academic_year}</span></div>
      :
      <div className="bg-white flex gap-2 items-center px-4 py-1 rounded"><span className="font-bold italic text-lg tracking-widest">Annual Year :</span><span>{sp.this_year ? sp.this_year : new Date().getFullYear()}</span></div>
    }

    <form action={LoadStatsByYear} className="flex gap-2 items-center justify-center">
      {sortedAcadYears ? <select name="academic_year" defaultValue={sp && sp.academic_year ? sp.academic_year : `${parseInt(sortedAcadYears[0]?.slice(5, 9)) - 1}/${sortedAcadYears[0]?.slice(5, 9)}`} className="border px-4 py-1 rounded w-60">
        <option value={`${sortedAcadYears[0]?.slice(5, 9)}/${parseInt(sortedAcadYears[0]?.slice(5, 9)) + 1}`}>{sortedAcadYears[0]?.slice(5, 9)}</option>
        {sortedAcadYears && sortedAcadYears?.map((item: string) => <option value={item} key={item}>{item.slice(0, 4)}</option>)}
      </select> : null}
      <select name="period" defaultValue={sp.period} className="border px-2 py-1 rounded w-40">
        <option value="an_year">Show Annual Year</option>
        <option value="ac_year">Show Academic Year</option>
      </select>
      <button type="submit" className="bg-bluedark border p-1 px-2 rounded text-white tracking-widest">Load</button>
    </form>

  </div>
}

export default SearchComp;
