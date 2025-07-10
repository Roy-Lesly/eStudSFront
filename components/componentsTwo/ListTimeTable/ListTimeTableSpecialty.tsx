import FormModal from "@/componentsTwo/FormModal";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus, FaRightLong } from "react-icons/fa6";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import TableSearchSelect from "../TableSearchSelect";
const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Class Name",
    accessor: "main_specialty__specialty_name",
    className: "table-cell w-3/12 md:w-7/12",
  },
  {
    header: "Year",
    accessor: "academic_year",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Level",
    accessor: "level__level",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/12 md:w-1/12",
  },
];

const ListTimeTableSpecialty = async ({ params, data, apiYears, lastYear }: { params: any, data: GetSpecialtyInter[] | any, apiYears: string[], lastYear: string }) => {

  const thisYear = new Date().getFullYear()

  const renderRow = (item: GetSpecialtyInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="table-cell">{item.specialty_name}</td>
      <td className="hidden md:table-cell">{item.academic_year}</td>
      <td className="hidden md:table-cell">{item.level}</td>
      <td>
        <div className="flex gap-4 items-center rounded-full">
          <FormModal table="timetable_select_month" type="update" params={params} data={item} icon={<FaPlus />} />
          <div className="bg-blue-800 border flex gap-2 items-center justify-center p-[6px] rounded-full text-white">
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${item.id}/list`}><FaRightLong /></Link>
          </div>
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 gap-2 m-2 mt-1 p-2 rounded-md text-black">

      {/* <TabsSpecialty params={params} page={0} /> */}

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Time Classes"} />
          <TableSearchSelect searchString="academic_year" data={apiYears.sort((a: string, b: string) => a[3] > b[3] ? -1 : a[3] < b[3] ? 1 : 0)} />
        </div>
      </div>

      {lastYear ?
        <div key={lastYear} className="flex flex-col gap-2">
          <h1 className="text-center tracking-widest">{lastYear}</h1>
          <Table key={lastYear}
            columns={columns}
            renderRow={renderRow}
            data={data.filter((spec: GetSpecialtyInter) => spec.academic_year == lastYear).sort((a: GetSpecialtyInter, b: GetSpecialtyInter) => a.level > b.level ? 1 : a.level < b.level ? -1 : 0)}
          />
        </div>
        :
        [`${thisYear}/${thisYear + 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear - 2}/${thisYear - 1}`,].map((year: string) =>
          <div key={year} className="flex flex-col gap-2">
            <h1 className="text-center tracking-widest">{year}</h1>
            <Table key={year}
              columns={columns}
              renderRow={renderRow}
              data={data.filter((spec: GetSpecialtyInter) => spec.academic_year == year).sort((a: GetSpecialtyInter, b: GetSpecialtyInter) => a.level > b.level ? 1 : a.level < b.level ? -1 : 0)}
            />
          </div>
        )}

    </div>
  );
};

export default ListTimeTableSpecialty;


const SearchByYear = () => {
  const thisYear = new Date().getFullYear();

  const Search = ((formVals: any) => {
    const newData = {
      year: formVals.year,
    }
    if (newData) {
      redirect(``)
    }
  })

  // return <form action={Search} className="flex gap-2">
  return <form className="flex gap-2">
    <select name="year" className="border px-4 py-2 rounded">
      {[`${thisYear}/${thisYear + 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear - 2}/${thisYear - 1}`,].map((year: string) =>
        <option key={year}>{year}</option>)}
    </select>
    <button type="submit"><Image src="/icons/search.png" alt="" width={14} height={14} /></button>
  </form>
}
