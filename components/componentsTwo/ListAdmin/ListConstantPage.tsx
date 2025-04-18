import TabsAdmin from "@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageAdmin/TabsAdmin";
import FormModal from "@/componentsTwo/FormModal";
import { role, teachersData } from "@/componentsTwo/lib/data";
import Pagination from "@/componentsTwo/Pagination";
import Table from "@/componentsTwo/Table";
import TableSearch from "@/componentsTwo/TableSearch";
import { TableRowClassName } from "@/constants";
import { SysConstantInter } from "@/Domain/Utils-H/appControl/appInter";
import MyButtonRefresh from "@/section-h/common/MyButtons/MyButtonRefresh";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import Image from "next/image";
import Link from "next/link";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";

type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
};

const columns = [
  {
    header: "No",
    accessor: "id",
    className: "md:table-cell md:w-1/12 hidden",
  },
  {
    header: "Name",
    accessor: "name",
    className: "table-cell w-6/12",
  },
  {
    header: "Category",
    accessor: "sys_category__id",
    className: "table-cell w-5/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell md:w-1/6 w-1/12",
  },
];

const ListConstantPage = ({ params, data }: { params: any, data: SysConstantInter[] | any }) => {

  const renderRow = (item: SysConstantInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.md}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.name}</td>
      <td className="md:table-cell">{item.sys_category__name}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="sys_constant" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          {role === "admin" && (
            <FormModal table="sys_constant" type="delete" id={item.id} params={params} data={item} icon={<RiDeleteBin2Line />} />
          )}
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md text-black">

      {/* TAB */}
      <TabsAdmin params={params} page={1} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:gap-2">
        <div className="flex gap-2 items-center md:gap-4 w-full">
          <MyPageTitle title={"System Value"} />
          <TableSearch placeholder="Search By Name" searchString="name" />
          <TableSearch placeholder="Search By Category" searchString="sys_category__name" />
          <MyButtonRefresh href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/SysConstant`} />
        </div>
        <div className="flex flex-row gap-2 items-end justify-end md:gap-4 md:w-60 self-end w-full">
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            {role === "admin" && (
              <FormModal table="sys_constant" type="create" params={params} icon={<FaPlus />} />
            )}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};

export default ListConstantPage;
