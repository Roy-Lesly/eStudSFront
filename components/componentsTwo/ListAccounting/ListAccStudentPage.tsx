import TabsAccAnalDomain from "@/[locale]/[domain]/Section-H/pageAccounting/[school_id]/pageAnalyses/TabsAccAnalDomain";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetDomainInter, GetLevelInter } from "@/Domain/Utils-H/appControl/appInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { redirect } from "next/navigation";
import MyTabs from "../MyTabs";
import { FaDownload } from "react-icons/fa6";
import MessageModal from "../MessageModal";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Full Name",
    accessor: "specialty_name",
    className: "table-cell w-11/12 md:w-4/12",
  },
  {
    header: "Class",
    accessor: "level",
    className: "hidden md:table-cell w-1/12 md:w-3/12",
  },
  {
    header: "Level",
    accessor: "level",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Year",
    accessor: "total",
    className: "md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Tuition",
    accessor: "paid",
    className: "md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Paid",
    accessor: "paid",
    className: "md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Pending",
    accessor: "balance",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
];

const ListAccStudentPage = ({ params, searchParams, data, years, thisYear, levels, domains }
  :
  { params: any, searchParams: any, data: any[] | any, years: any[], thisYear: string, levels: GetLevelInter[], domains: GetDomainInter[] }) => {
  const renderRow = (item: any, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="table-cell">{item.userprofile__user__full_name}</td>
      <td className="hidden md:table-cell">{item.userprofile__specialty__main_specialty__specialty_name}</td>
      <td className="hidden md:table-cell">{item.userprofile__specialty__level__level}</td>
      <td className="hidden md:table-cell">{item.userprofile__specialty__academic_year}</td>
      <td className="hidden md:table-cell">{(item.userprofile__specialty__tuition).toLocaleString()}F</td>
      <td className="hidden md:table-cell">{(item.userprofile__specialty__tuition - item.balance).toLocaleString()}F</td>
      <td className="hidden md:table-cell">{(item.balance).toLocaleString()}F</td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md text-black">

      <MyTabs
        page={0}
        data={[
          // { page: 0,  title: "", link: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageAnalyses/pageDomain`},
          // { page: 2,  title: "", link: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageAnalyses/pageSpecialty`},
        ]}
      />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Student Analyses"} params={params} />
          <div className="font-semi-bold hidden italic md:flex tracking-widest">{thisYear}</div>
          <div>
            {searchParams ? <MessageModal
              table="excel_accounting_info" 
              type="custom"
              params={params} icon={<span className="flex gap-1 items-center justify-center"><FaDownload size={12} /></span>} 
              data={data}
              extra_data={{ 
                searchParams: searchParams, 
                type: "analyses_students", 
                export_title: `StudentsFee`,
                worksheet_name: "Students" 
              }}
              customClassName={`flex gap-2 bg-bluedash px-3 py-1 text-white font-medium capitalize gap-2 cursor-pointer`}
            /> : null}
          </div>
          <div className="w-full">
            <SelectYear
              domains={domains}
              levels={levels}
              years={years}
              thisYear={thisYear}
              link={`${params.domain}/Section-H/pageAccounting/${params.school_id}/pageAnalyses/analysesStudent`}
            />
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data.sort((a: any, b: any) => a.level > b.level ? 1 : a.level < b.level ? -1 : 0)} />
    </div>
  );
};

export default ListAccStudentPage;

export const SelectYear = ({ domains, levels, years, link, thisYear }: any) => {

  const search = async (formData: FormData) => {
    "use server"
    var domain = formData.get("domain")
    var level = formData.get("level")
    var year = formData.get("year")

    if (year && (domain || level)) {
      redirect(`/${link}?userprofile__specialty__academic_year=${year}&userprofile__specialty__main_specialty__field__domain__id=${domain}&userprofile__specialty__level__level=${level}`)
    }
    if (year) {
      redirect(`/${link}?user_profile__specialty__academic_year=${year}`)
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