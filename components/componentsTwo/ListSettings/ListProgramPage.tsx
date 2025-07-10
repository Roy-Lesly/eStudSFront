import FormModal from "@/componentsTwo/FormModal";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetProgramInter } from "@/Domain/Utils-H/userControl/userInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-2/12",
  },
  {
    header: "Name",
    accessor: "name",
    className: "table-cell w-6/12 md:w-8/12",
  },
  {
    header: "Description",
    accessor: "description",
    className: "hidden md:table-cell md:w-4/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/12 md:w-2/12",
  },
];

const ListProgramPage = ({ params, data }: { params: any, data: GetProgramInter[] | any }) => {

  const renderRow = (item: GetProgramInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.name}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="program" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="program" type="delete" params={params} data={item} icon={<FaPlus />}  />
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
        <MyPageTitle title={"Programs"} />
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
          <button className="flex h-7 items-center justify-center rounded-full w-10">
          <FormModal table="program" type="create" params={params} icon={<FaPlus />}  />
          </button>
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};

export default ListProgramPage;
