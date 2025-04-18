import TabsAdmin from "@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageAdmin/TabsAdmin";
import FormModal from "@/componentsTwo/FormModal";
import { role, teachersData } from "@/componentsTwo/lib/data";
import Pagination from "@/componentsTwo/Pagination";
import Table from "@/componentsTwo/Table";
import TableSearch from "@/componentsTwo/TableSearch";
import { TableRowClassName } from "@/constants";
import { SysCategoryInter } from "@/Domain/Utils-H/appControl/appInter";
import MyButtonRefresh from "@/section-h/common/MyButtons/MyButtonRefresh";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import Image from "next/image";
import Link from "next/link";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
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
    className: "table-cell w-1/6",
  },
  {
    header: "Name",
    accessor: "name",
    className: "table-cell w-3/4",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/6",
  },
];

const ListCategoryPage = ({ params, data }: { params: any, data: SysCategoryInter[] | any }) => {

  const renderRow = (item: SysCategoryInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.md}`}
    >
      <td className="table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.name}</td>
      <td>
        <div className="gap-2 hidden items-center md:flex">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="sys_category" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          {role === "admin" && (
            <FormModal table="sys_category" type="delete" id={item.id} params={params} data={item} icon={<RiDeleteBin2Line />} />
          )}
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md text-black">

      {/* TAB */}
      <TabsAdmin params={params} page={0} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Value Category"} />
          <TableSearch placeholder="Search By Name" searchString="name" />
          <MyButtonRefresh href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin`} />
        </div>
        <div className="flex flex-row gap-2 items-end justify-end md:gap-4 md:w-60 self-end w-full">
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            {role === "admin" && (
              <FormModal table="sys_category" type="create" params={params} icon={<FaPlus />} />
            )}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};

export default ListCategoryPage;
