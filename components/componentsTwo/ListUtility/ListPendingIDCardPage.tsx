import FormModal from "@/componentsTwo/FormModal";
import Table from "@/componentsTwo/Table";
import TableSearch from "@/componentsTwo/TableSearch";
import { TableRowClassName } from "@/constants";
import { EdgeSchoolFees } from "@/Domain/schemas/interfaceGraphql";
import initTranslations from "@/initTranslations";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus } from "react-icons/fa6";


const columns = [
  {
    header: "No",
    accessor: "",
    className: "table-cell w-1/12",
  },
  {
    header: "Matricle",
    accessor: "matricle",
    className: "table-cell w-1/6",
  },
  {
    header: "Full Name",
    accessor: "full_name",
    className: "table-cell w-3/12",
  },
  {
    header: "Class",
    accessor: "specialty_name",
    className: "table-cell w-3/12",
  },
  {
    header: "Level",
    accessor: "level",
    className: "table-cell w-1/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/6",
  },
];

const ListPendingIDCardPage = async ({ params, data }: { params: any, data: EdgeSchoolFees[] }) => {

  const { t } = await initTranslations(params.locale, ['common']);

  const renderRow = (item: EdgeSchoolFees, index: number) => (
    <tr
      key={index + 1}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="">{index + 1}</td>
      <td className="">{item.node.userprofile.user.matricle}</td>
      <td className="">{item.node.userprofile.user.fullName}</td>
      <td className="">{item.node.userprofile.specialty.mainSpecialty.specialtyName}</td>
      <td className="">{item.node.userprofile.specialty.level.level}</td>
      <td>
        <div className="flex gap-2 items-center justify-center">
          <FormModal
            table="platform_and_id_card"
            type="custom"
            params={params}
            icon={<FaPlus />}
            data={[item]}
            extra_data={{
              url: `${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pageIDCard/`,
              reason: "id_card"
            }}
            buttonTitle={`Pay`}
            customClassName={`flex gap-2 border bg-bluedash px-6 py-2 rounded text-white font-medium capitalize gap-2 cursor-pointer`}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Pending Student ID Card Payment"} />
          <div className="flex flex-col gap-4 items-center md:flex-row md:w-auto w-full">
            <TableSearch placeholder="By Name" searchString="full_name" />
          </div>
          <div>
            <FormModal
              table="platform_and_id_card"
              type="custom"
              params={params}
              icon={<FaPlus />}
              data={data}
              extra_data={{
                url: `${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pageIDCard/`,
                reason: "id_card",
              }}
              buttonTitle={`Pay All`}
              customClassName={`flex gap-2 border bg-bluedash px-6 py-2 rounded text-white font-medium capitalize gap-2 cursor-pointer`}
            />
          </div>
        </div>
      </div>

      {data?.length ?
        <Table columns={columns} renderRow={renderRow} data={data.sort((a: EdgeSchoolFees, b: EdgeSchoolFees) => a.node.userprofile.user.fullName > b.node.userprofile.user.fullName ? 1 : a.node.userprofile.user.fullName < b.node.userprofile.user.fullName ? -1 : 0)} />
        :
        <div>No Data Found</div>
      }
      
    </div>
  );
};

export default ListPendingIDCardPage;
