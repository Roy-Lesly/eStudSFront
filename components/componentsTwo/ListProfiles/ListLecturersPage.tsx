import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaDownload, FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import TableSearch from "../TableSearch";
import { getData } from "@/functions";
import { protocol } from "@/config";
import { AcademicYearUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetCustomUserInter } from "@/Domain/Utils-H/userControl/userInter";
import MessageModal from "../MessageModal";
import TabsLecturer from "../TabsProfiles/TabsLecturer";


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
    className: "table-cell w-9/12 md:w-5/12",
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
    header: "Actions",
    accessor: "action",
    className: "table-cell w-3/12 md:w-1/12",
  },
];

const ListLecturersPage = async ({ params, searchParams, data }: { params: any, searchParams: any, data: GetCustomUserInter[] | any }) => {

  const apiYear = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id }, params.domain)

  const renderRow = (item: GetCustomUserInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="hidden md:table-cell">{item.matricle}</td>
      <td className="table-cell">{item.full_name}</td>
      <td className="hidden md:table-cell">{item.telephone}</td>
      <td className="hidden md:table-cell">{item.sex}</td>
      <td className="hidden md:table-cell">{item.title}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="lecturer" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          {role === "admin" && (
            <FormModal table="lecturer" type="delete" id={item.id} params={params} data={item} icon={<RiDeleteBin2Line />} />
          )}
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      <TabsLecturer params={params} page={0} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={`Lecturers ${data.length}`} />
          <TableSearch placeholder="By Name" searchString="full_name" />
          <div>
          {searchParams && Object.keys(searchParams).length ? <MessageModal
              table="excel_profiles"
              type="custom"
              params={params} icon={<span className="flex gap-1 items-center justify-center p-1 rounded"><FaDownload size={16} /></span>} 
              data={data}
              extra_data={{
                searchParams: searchParams,
                type: "profiles_teachers",
                export_title: `Lecturers`,
                worksheet_name: "Lecturers List",
                campus_id: params.school_id
              }}
              customClassName={`flex gap-2 bg-bluedash px-3 py-1 text-white font-medium capitalize gap-2 cursor-pointer rounded-full`}
            /> : null}
          </div>
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            {role === "admin" && (
              <FormModal
                table="lecturer"
                type="create"
                params={params}
                icon={<FaPlus
                />}
              />
            )}
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-1">
        <Table
          columns={columns}
          renderRow={renderRow}
          data={data}
        />
      </div>
    </div>
  );
};

export default ListLecturersPage;
