import TabsAccAnalDomain from "@/[locale]/[domain]/Section-H/pageAccounting/[school_id]/pageAnalyses/TabsAccAnalDomain";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetDomainInter, GetLevelInter } from "@/Domain/Utils-H/appControl/appInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { redirect } from "next/navigation";
import MyTabs from "../MyTabs";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Class Name",
    accessor: "specialty_name",
    className: "table-cell w-11/12 md:w-4/12",
  },
  {
    header: "Level",
    accessor: "level",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Expected",
    accessor: "total",
    className: "md:table-cell w-1/12 md:w-1.5/12",
  },
  {
    header: "Paid",
    accessor: "paid",
    className: "md:table-cell w-1/12 md:w-1.5/12",
  },
  {
    header: "Pending",
    accessor: "balance",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Year",
    accessor: "year",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Students",
    accessor: "count",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
];

const ListAccTransactionPage = ({ params, data, years, thisYear, levels, domains }
  : 
  { params: any, data: any[] | any, years: any[], thisYear: string, levels: GetLevelInter[], domains: GetDomainInter[] }) => {
  const renderRow = (item: any, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="table-cell">{item.specialty_name}</td>
      <td className="hidden md:table-cell">{item.level}</td>
      <td className="md:table-cell">{item.total.toLocaleString()}</td>
      <td className="md:table-cell">{item.paid.toLocaleString()}</td>
      <td className="hidden md:table-cell">{item.balance.toLocaleString()}</td>
      <td className="hidden md:table-cell">{item.year}</td>
      <td className="hidden md:table-cell">{item.count}</td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md text-black">

      <MyTabs
        page={1} 
        data={[
          { page: 0,  title: "New", link: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageFees`},
          { page: 1,  title: "List", link: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageFees/pageList`},
        ]}
      />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"School Fee Transations"} params={params} />
          <div className="font-semi-bold hidden italic md:flex tracking-widest">{thisYear}</div>
          <SelectYear 
          domains={domains} 
          levels={levels} 
          years={years} 
          thisYear={thisYear} 
          link={`${params.domain}/Section-H/pageAccounting/${params.school_id}/pageFees/pageList`} />
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data.sort((a: any, b: any) => a.level > b.level ? 1 : a.level < b.level ? -1 : 0 )} />
    </div>
  );
};

export default ListAccTransactionPage;

export const SelectYear = ({ domains, levels, years, link, thisYear }: any) => {

  const search = async (formData: FormData) => {
    "use server"
    var domain = formData.get("domain")
    var level = formData.get("level")
    var year = formData.get("year")

    if (year && (domain || level)) {
      redirect(`/${link}?academic_year=${year}&domain=${domain}&level=${level}`)
    }
    if (year) {
      redirect(`/${link}?academic_year=${year}`)
    }

  }
  return <form action={search} className="flex gap-2">
    <select defaultValue={thisYear} name="domain" className="border px-4 py-1 rounded">
      <option value="">------------</option>
      {domains.map((item: GetDomainInter) => <option key={item.id} value={item.id}>{item.domain_name}</option>)}
    </select>
    <select defaultValue={thisYear} name="level" className="border px-4 py-1 rounded">
      <option value="">------------</option>
      {levels.map((item: GetLevelInter) => <option key={item.id} value={item.id}>{item.level}</option>)}
    </select>
    <select defaultValue={thisYear} name="year" className="border px-4 py-1 rounded">
      <option value="">------------</option>
      {years.map((item: string) => <option key={item} value={item}>{item}</option>)}
    </select>
    <button type="submit" className="px-4 py-1 rounded">Search</button>
  </form>
}