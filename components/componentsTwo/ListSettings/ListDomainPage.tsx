import FormModal from "@/componentsTwo/FormModal";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetDomainInter } from "@/Domain/Utils-H/appControl/appInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import TableSearch from "../TableSearch";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-2/12",
  },
  {
    header: "Name",
    accessor: "domain_name",
    className: "table-cell w-10/12 md:w-9/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-2/12 md:w-1/12",
  },
];

const ListDomainPage = ({ params, data }: { params: any, data: GetDomainInter[] | any }) => {

  const renderRow = (item: GetDomainInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.domain_name}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="domain" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="domain" type="delete" params={params} data={item} icon={<RiDeleteBin2Line />} />
          </button>
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">

          <MyPageTitle title={"Domains"} />

          <TableSearch placeholder="By Domain Name" searchString="domain_name" />

          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            <FormModal table="domain" type="create" params={params} icon={<FaPlus />} />
          </div>
          
        </div>

      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};

export default ListDomainPage;
