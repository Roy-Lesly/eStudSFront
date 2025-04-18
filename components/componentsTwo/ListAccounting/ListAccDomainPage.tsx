import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { redirect } from "next/navigation";
import MyTabs from "../MyTabs";
import MessageModal from "../MessageModal";
import { FaDownload } from "react-icons/fa6";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Domain Name",
    accessor: "domain_name",
    className: "table-cell w-3/12 md:w-4/12",
  },
  {
    header: "Year",
    accessor: "year",
    className: "hidden md:table-cell w-1/12 md:w-1.5/12",
  },
  {
    header: "Expected",
    accessor: "total",
    className: "hidden md:table-cell w-1/12 md:w-1.5/12",
  },
  {
    header: "Paid",
    accessor: "paid",
    className: "hidden md:table-cell w-1/12 md:w-1.5/12",
  },
  {
    header: "Pending",
    accessor: "balance",
    className: "hidden md:table-cell w-1/12 md:w-1.5/12",
  },
  {
    header: "Students",
    accessor: "count",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
];

const ListAccDomainPage = ({ params, searchParams, data, years, thisYear }: { params: any, searchParams: any, data: any[] | any, years: any[], thisYear: string }) => {
  const renderRow = (item: any, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.md}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="table-cell">{item.domain_name}</td>
      <td className="hidden md:table-cell">{item.year}</td>
      <td className="hidden md:table-cell">{item.total.toLocaleString()}</td>
      <td className="hidden md:table-cell">{item.paid.toLocaleString()}</td>
      <td className="hidden md:table-cell">{item.balance.toLocaleString()}</td>
      <td className="hidden md:table-cell">{item.count}</td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md text-black">

      <MyTabs
        page={0}
        data={[
          { page: 0, title: "", link: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageAnalyses/pageDomain` },
          { page: 1, title: "", link: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageAnalyses/pageField` },
          { page: 2, title: "", link: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageAnalyses/pageSpecialty` },
        ]}
      />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Domain Analyses"} params={params} />
          <div className="font-semi-bold hidden italic md:flex tracking-widest">{thisYear}</div>
          <div>
            {searchParams ? <MessageModal
              table="excel_accounting_info" 
              type="custom"
              params={params} icon={<span className="flex gap-1 items-center justify-center"><FaDownload size={12} /></span>} 
              data={data}
              extra_data={{ 
                searchParams: searchParams, 
                type: "analyses_domains", 
                export_title: `DomainFee`,
                worksheet_name: "Domains" 
              }}
              customClassName={`flex gap-2 bg-bluedash px-3 py-1 text-white font-medium capitalize gap-2 cursor-pointer`}
            /> : null}
          </div>
          <SelectYear years={years} thisYear={thisYear} link={`${params.domain}/Section-H/pageAccounting/${params.school_id}/pageAnalyses/analysesDomain`} />
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};

export default ListAccDomainPage;

export const SelectYear = ({ years, link, thisYear }: any) => {

  const search = async (formData: FormData) => {
    "use server"
    var year = formData.get("year")
    if (year) {
      redirect(`/${link}?academic_year=${year}`)
    }

  }
  return <form action={search} className="flex gap-2">
    <select defaultValue={thisYear} name="year" className="border px-4 py-1 rounded">
      <option value="">------------</option>
      {years.map((item: string) => <option key={item} value={item}>{item}</option>)}
    </select>
    <button type="submit" className="px-4 py-1 rounded">Search</button>
  </form>
}