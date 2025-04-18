import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import TableSearch from "../TableSearch";
import { GetCustomUserInter } from "@/Domain/Utils-H/userControl/userInter";
import TabsUsers from "@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageUsers/TabsUsers";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Username",
    accessor: "username",
    className: "hidden md:table-cell w-3/12 md:w-1/12",
  },
  {
    header: "Full Name",
    accessor: "full_name",
    className: "table-cell w-10/12 md:w-5/12",
  },
  {
    header: "Telephone",
    accessor: "telephone",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Gender",
    accessor: "sex",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Title",
    accessor: "title",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Last Login",
    accessor: "title",
    className: "hidden md:table-cell w-1/12 md:w-1/12 text-sm",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-2/12 md:w-1/12",
  },
];
const columnsStudent = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Matricle",
    accessor: "username",
    className: "hidden md:table-cell w-3/12 md:w-2/12",
  },
  {
    header: "Full Name",
    accessor: "full_name",
    className: "table-cell w-10/12 md:w-5/12",
  },
  {
    header: "Telephone",
    accessor: "telephone",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Gender",
    accessor: "sex",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Last Login",
    accessor: "last_login",
    className: "hidden md:table-cell text-sm w-1/12 md:w-1/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-2/12 md:w-1/12",
  },
];

const ListUsersPage = async ({ params, data, user_type, page, extra_data, }: { user_type: string, page: number, params: any, extra_data: any, data: GetCustomUserInter[] | any }) => {

  const renderRow = (item: GetCustomUserInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className={`hidden md:table-cell `}><span className={`${item.is_active?.toString() == "True" ? "bg-green-600" : "bg-redlight"} rounded text-center py-1 px-1 text-white`}>{item.matricle}</span></td>
      <td className="table-cell">{item.full_name}</td>
      <td className="hidden md:table-cell">{item.telephone}</td>
      <td className="hidden md:table-cell">{item.sex}</td>
      {extra_data != "student" && <td className="hidden md:table-cell">{item.title}</td>}
      <td className="hidden md:table-cell text-sm">{item.last_login?.slice(2, 16)}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="users" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} extra_data={extra_data} />
          </button>
          {role === "admin" && (
            <FormModal table="users" type="delete" id={item.id} params={params} data={item} icon={<RiDeleteBin2Line />} extra_data={extra_data} />
          )}
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      <TabsUsers params={params} page={page} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={`${user_type} Users`} />
          <TableSearch placeholder="By Name" searchString="full_name" />
        </div>
      </div>


      <div className="flex flex-col gap-1">
      {extra_data[0] == "student" ? <Table columns={columnsStudent} renderRow={renderRow} data={data} />
      :
      <Table columns={columns} renderRow={renderRow} data={data} />}
      </div>
    </div>
  );
};

export default ListUsersPage;
