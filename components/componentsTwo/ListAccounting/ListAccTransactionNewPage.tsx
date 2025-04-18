import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetDomainInter, GetLevelInter } from "@/Domain/Utils-H/appControl/appInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { redirect } from "next/navigation";
import MyTabs from "../MyTabs";
import FormModal from "../FormModal";
import { FaEye, FaPlus } from "react-icons/fa6";
import { GetSchoolFeesInter } from "@/Domain/Utils-H/feesControl/feesInter";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Full Name",
    accessor: "userprofile__user__full_name",
    className: "table-cell w-11/12 md:w-4/12",
  },
  {
    header: "Class",
    accessor: "level",
    className: "hidden md:table-cell w-1/12 md:w-3/12",
  },
  {
    header: "Level",
    accessor: "total",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Amount",
    accessor: "paid",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Action",
    accessor: "year",
    className: "table-cell w-1/12 md:w-1/12",
  },
];
const columnsFees = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Full Name",
    accessor: "userprofile__user__full_name",
    className: "table-cell w-11/12 md:w-4/12",
  },
  {
    header: "Class",
    accessor: "userprofile__specialty__main_specialty__specialty_name",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Year",
    accessor: "userprofile__specialty__academic_year",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Level",
    accessor: "userprofile__specialty__level__level",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Balance",
    accessor: "balance",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Action",
    accessor: "action",
    className: "table-cell w-1/12 md:w-1/12 ",
  },
];

const ListAccTransactionNewPage = ({ params, data, apiDomains, apiSchoolFees }
  :
  { params: any, data: any[] | any, apiDomains: GetDomainInter[], apiSchoolFees: GetSchoolFeesInter[] | undefined }) => {
  const renderRowFees = (item: any, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="table-cell">{item.userprofile__user__full_name}</td>
      <td className="hidden md:table-cell">{item.userprofile__specialty__main_specialty__specialty_name}</td>
      <td className="hidden md:table-cell">{item.userprofile__specialty__level__level}</td>
      <td className="hidden md:table-cell">{item.userprofile__specialty__academic_year}</td>
      <td className="hidden md:table-cell">{item.balance}</td>
      <td className="table-cell">
      <FormModal table="create_fees" data={item} type="create" params={params} icon={<FaEye size={20} />} />
        </td>
    </tr>
  );
  const renderRow = (item: any, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="table-cell">{item.schoolfees__userprofile__user__full_name}</td>
      <td className="hidden md:table-cell">{item.schoolfees__userprofile__specialty__main_specialty__specialty_name}</td>
      <td className="hidden md:table-cell">{item.schoolfees__userprofile__specialty__level__level}</td>
      <td className="hidden md:table-cell">{item.amount.toLocaleString()}</td>
      <td className="md:table-cell">
      <FormModal table="create_fees" data={item} type="update" params={params} icon={<FaEye size={30} />} />
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md text-black">

      <MyTabs
        page={0}
        data={[
          { page: 0, title: "New", link: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageFees` },
          { page: 1, title: "List", link: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageFees/pageList` },
        ]}
      />

      {/* TOP */}

      <div className="flex flex-center gap-4 items-center justify-center mb-6 md:gap-2 mt-10 w-full">
        <FormModal table="create_fees_preselect" data={apiDomains} type="create" params={params} icon={<FaPlus size={30} />} />
      </div>



      {apiSchoolFees ?
        <div className="flex flex-col md:mt-6 w-full">
          <MyPageTitle title={"Search Results"} params={params} />
          <Table columns={columnsFees} renderRow={renderRowFees} data={apiSchoolFees.sort((a: any, b: any) => a.userprofile__user__full_name > b.userprofile__user__full_name ? 1 : a.userprofile__user__full_name < b.userprofile__user__full_name ? -1 : 0)} />
        </div> 
        
        :

        <div className="flex flex-col md:mt-6 w-full">
          <span className="flex font-semibold justify-center text-center text-lg tracking-widest">Today Transactions</span>
          <Table columns={columns} renderRow={renderRow} data={data.sort((a: any, b: any) => a.schoolfees__userprofile__user__full_name > b.schoolfees__userprofile__user__full_name ? 1 : a.schoolfees__userprofile__user__full_name < b.schoolfees__userprofile__user__full_name ? -1 : 0)} />
        </div>
      }

    </div>
  );
};

export default ListAccTransactionNewPage;

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