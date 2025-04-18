import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import TableSearch from "@/componentsTwo/TableSearch";
import { TableRowClassName } from "@/constants";
import { GetDepartmentInter } from "@/Domain/Utils-H/userControl/userInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "table-cell w-2/12",
  },
  {
    header: "Name",
    accessor: "name",
    className: "table-cell w-9/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/12",
  },
];

const ListDepartmentPage = ({ params, data }: { params: any, data: GetDepartmentInter[] | any }) => {

  const renderRow = (item: GetDepartmentInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.md}`}
    >
      <td className="table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.name}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="department" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          {role === "admin" && (
            <FormModal table="department" type="delete" id={item.id} params={params} data={item} icon={<RiDeleteBin2Line />}  />
          )}
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
        <MyPageTitle title={"Department"} />

          <TableSearch placeholder="Search By Name" searchString="name" />
        </div>
        <div className="flex flex-row gap-2 items-end justify-end md:gap-4 md:w-60 self-end w-full">
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            {role === "admin" && (
              <FormModal table="department" type="create" params={params} icon={<FaPlus />} />
            )}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};

export default ListDepartmentPage;
