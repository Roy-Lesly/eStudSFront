import FormModal from "@/componentsTwo/FormModal";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetMainSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import TabsSpecialty from "../TabsSettings/TabsSpecialty";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Class Name",
    accessor: "specialty_name",
    className: "table-cell w-10/12 md:w-4/12",
  },
  {
    header: "Short",
    accessor: "specialty_name_short",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Field",
    accessor: "field__field_name",
    className: "hidden md:table-cell md:w-5/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-2/12 md:w-1/12",
  },
];

const ListMainSpecialtyPage = ({ params, data }: { params: any, data: GetMainSpecialtyInter[] | any }) => {

  const renderRow = (item: GetMainSpecialtyInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.md}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="table-cell">{item.specialty_name}</td>
      <td className="hidden md:table-cell">{item.specialty_name_short}</td>
      <td className="hidden md:table-cell">{item.field_name}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="main_specialty" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          <button className="field-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="main_specialty" type="delete" params={params} data={item} icon={<RiDeleteBin2Line />} />
          </button>
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white dark:bg-slate-200 flex-1 m-2 mt-1 p-2 rounded-md text-black">

      <TabsSpecialty params={params} page={1} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Titles"} />
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            <button className="flex h-7 items-center justify-center rounded-full w-10">
              <FormModal table="main_specialty" type="create" params={params} icon={<FaPlus />} />
            </button>
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};

export default ListMainSpecialtyPage;
