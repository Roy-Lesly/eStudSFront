import FormModal from "@/componentsTwo/FormModal";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { FaRightLong } from "react-icons/fa6";
import TableSearch from "../TableSearch";
import { GetPreInscriptionInter } from "@/Domain/Utils-H/userControl/userInter";
import TabsPreInscription from "../TabsProfiles/TabsPreInscription";
import MessageModal from "../MessageModal";


const columns = [
  {
    header: "No",
    accessor: "registration_number",
    className: "hidden md:table-cell w-2/12 md:w-2/12",
  },
  {
    header: "Full Name",
    accessor: "full_name",
    className: "table-cell w-10/12 md:w-3/12",
  },
  {
    header: "Telephone",
    accessor: "telephone",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "1st Choice",
    accessor: "specialty_one",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Sex",
    accessor: "Gender",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "DOB",
    accessor: "dob",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "POB",
    accessor: "pob",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-2/12 md:w-1/12 text-center flex",
  },
];

const ListPreInscriptionPage = async (
  { params, data, page, extra_data }
  : 
  { params: any, data: GetPreInscriptionInter[] | any, page: number, extra_data: any }
) => {

  console.log(extra_data, 600000)
  const renderRow = (item: GetPreInscriptionInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{item.registration_number}</td>
      <td className="table-cell">{item.full_name}</td>
      <td className="hidden md:table-cell">{item.telephone}</td>
      <td className="hidden md:table-cell">{item.specialty_one}</td>
      <td className="hidden md:table-cell">{item.sex}</td>
      <td className="hidden md:table-cell">{item.dob}</td>
      <td className="hidden md:table-cell">{page == 3 ? item.campus : item.pob}</td>
      <td>
        <div className="flex gap-2 items-center justify-center">
          <div>
            {item.status == "PENDING" ?
            <FormModal
              table="admit_student_from_preinscription" type="custom"
              params={params} icon={<span className="flex gap-1 items-center justify-center">Admit <FaRightLong size={12} /></span>} data={item}
              extra_data={extra_data}
              customClassName={`flex gap-2 bg-bluedash px-3 py-1 text-white font-medium capitalize gap-2 cursor-pointer`}
            />
            :
            <MessageModal
              table="admitted_preincription_student_details" type="custom"
              params={params} icon={<span className="flex gap-1 items-center justify-center">Details <FaRightLong size={12} /></span>} data={item}
              extra_data={extra_data}
              customClassName={`flex gap-2 bg-bluedash px-3 py-1 text-white font-medium capitalize gap-2 cursor-pointer`}
            />
            }
          </div>        
          </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      <TabsPreInscription params={params} page={page} />


      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <TableSearch placeholder="By Name" searchString="full_name" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
    </div>
  );
};

export default ListPreInscriptionPage;
