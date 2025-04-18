// import TabsTranscript from "@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageResult/pageTranscript/TabsTranscript";
import Table from "@/componentsTwo/Table";
import MessageModal from "@/componentsTwo/MessageModal";
import { TableRowClassName } from "@/constants";
import { GetCourseInter } from "@/Domain/Utils-H/appControl/appInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import TableSearch from "../TableSearch";
import { GetTranscriptApplicationInter } from "@/Domain/Utils-H/feesControl/feesInter";
import { FaArrowRight } from "react-icons/fa6";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Matricle",
    accessor: "userprofile__user__matricle",
    className: "hidden md:table-cell w-3/12 md:w-2/12",
  },
  {
    header: "Student Name",
    accessor: "main_course__course_name",
    className: "table-cell w-3/12 md:w-3/12",
  },
  {
    header: "Class",
    accessor: "userprofile__specialty__main_specialty__specialty_name",
    className: "hidden md:table-cell w-2/12 md:w-4/12",
  },
  {
    header: "Date",
    accessor: "create_at",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Approve",
    accessor: "action",
    className: "table-cell w-1/12 md:w-1/12",
  },
];

const ListTranscriptPrintedPage = async ({ params, data }: { params: any, data: GetCourseInter[] | any }) => {
  const renderRow = (item: GetTranscriptApplicationInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="hidden md:table-cell">{item.matricle}</td>
      <td className="table-cell">{item.full_name}</td>
      <td className="hidden md:table-cell">{item.specialty_name.slice(0, 15)} - {item.academic_year} / {item.level}</td>
      <td className="hidden md:table-cell">{item.created_at.slice(0, 10)}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <MessageModal table="confirm_preview_transcript" type="custom" params={params} data={item} icon={<FaArrowRight />} extra_data={[`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`]} />
          </button>
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      {/* <TabsTranscript params={params} page={2} /> */}

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Printed Transcripts"} />
          <TableSearch placeholder="By Student Name" searchString="userprofile__user__full_name" />
          <div className="hidden md:flex"><TableSearch placeholder="By Matricle" searchString="userprofile__user__matricle" /></div>
        </div>
      </div>

      <Table
            columns={columns}
            renderRow={renderRow}
            data={data}
          />
    </div>
  );
};

export default ListTranscriptPrintedPage;
