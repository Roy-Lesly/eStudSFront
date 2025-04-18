import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import TableSearch from "@/componentsTwo/TableSearch";
import { GetAccountInter } from "@/Domain/Utils-H/feesControl/feesInter";
import Image from "next/image";
import Link from "next/link";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { TbRefresh } from "react-icons/tb";
import { RiDeleteBin2Line } from "react-icons/ri";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { TableRowClassName } from "@/constants";

const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:block table-cell w-1/12",
  },
  {
    header: "Name",
    accessor: "name",
    className: "table-cell w-5/12 md:w-4/12",
  },
  {
    header: "Number",
    accessor: "number",
    className: "hidden md:block table-cell w-2/12",
  },
  {
    header: "Year",
    accessor: "year",
    className: "table-cell w-4/12 md:w-2/12",
  },
  {
    header: "Balance",
    accessor: "balance",
    className: "table-cell w-1/4 md:w-2/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "hidden md:table-cell md:w-1/12",
  },
];

const ListAccountPage = ({ params, data }: { params: any, data: GetAccountInter[] | any }) => {

  const renderRow = (item: GetAccountInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.md}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.name}</td>
      <td className="hidden md:table-cell">{item.number}</td>
      <td className="md:table-cell">{item.year}</td>
      <td className="md:table-cell">{item.balance.toLocaleString()}</td>
      <td>
        <div className="gap-2 hidden items-center md:flex">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="account" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          {role === "admin" && (
            <FormModal table="account" type="delete" id={item.id} params={params} data={item} icon={<RiDeleteBin2Line />} />
          )}
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white dark:bg-slate-300 flex-1 m-2 mt-1 p-2 rounded-md text-black">

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Account"} />
          <TableSearch placeholder="Search By Name" searchString="name" />
          <TableSearch placeholder="Search By Year" searchString="year" />
        </div>
        <div className="flex flex-row gap-2 items-center justify-end md:gap-4 md:w-60 py-2 self-end w-full">
          <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account/UpdateAccount`} className="bg-blue-300 flex font-medium gap-1 items-center justify-center px-2 py-1 rounded">Update <TbRefresh /></Link>
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            <button className="bg-brown-300 flex h-8 items-center justify-center rounded-full w-10">
              <Image src="/icons/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="bg-yellow-300 flex h-8 items-center justify-center rounded-full w-10">
              <FaSortAlphaDown color="black" />
            </button>
            {role === "admin" && (
              <FormModal table="account" type="create" params={params} icon={<FaPlus />} />
            )}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />

    </div >
  );
};

export default ListAccountPage;
