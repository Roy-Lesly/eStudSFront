import FormModal from "@/componentsTwo/FormModal";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaRightLong } from "react-icons/fa6";
import TableSearch from "../TableSearch";
import { GetUserProfileInter } from "@/Domain/Utils-H/userControl/userInter";
import TabsUnAssignedStudents from "../TabsProfiles/TabsUnAssignedStudents";


const columns = [
  {
    header: "Matricle",
    accessor: "user__matricle",
    className: "hidden md:table-cell w-2/12 md:w-2/12",
  },
  {
    header: "Full Name",
    accessor: "user__full_name",
    className: "table-cell w-10/12 md:w-4/12",
  },
  {
    header: "Telephone",
    accessor: "user__telephone",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-2/12 md:w-1/12 text-center flex",
  },
];

const ListStudUnAssCampusPage = async ({ params, data, extra_data }: { params: any, data: GetUserProfileInter[] | any, extra_data: any[] }) => {

  const renderRow = (item: GetUserProfileInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{item.matricle}</td>
      <td className="table-cell">{item.full_name.slice(0, 35)}</td>
      <td className="hidden md:table-cell">{item.telephone}</td>
      <td>
        <div className="flex gap-2 items-center justify-center">

          <div>
            <FormModal
              table="assign_student_to_specialty" type="custom"
              params={params} icon={<span className="flex gap-1 items-center justify-center">Assign <FaRightLong size={12} /></span>} data={item}
              extra_data={extra_data}
              customClassName={`flex gap-2 bg-bluedash px-3 py-1 text-white font-medium capitalize gap-2 cursor-pointer`}
            />
          </div>        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      <TabsUnAssignedStudents page={1} params={params} />


      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Un-Assigned Students"} />
          <TableSearch placeholder="By Name" searchString="user__full_name" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
    </div>
  );
};

export default ListStudUnAssCampusPage;
