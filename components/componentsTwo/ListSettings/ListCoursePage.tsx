import FormModal from "@/componentsTwo/FormModal";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetCourseInter } from "@/Domain/Utils-H/appControl/appInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import TableSearch from "../TableSearch";
import { getData } from "@/functions";
import { protocol } from "@/config";
import { AcademicYearUrl, GetDomainUrl, GetLevelUrl, GetMainCourseUrl } from "@/Domain/Utils-H/appControl/appConfig";
import TabsCourse from "../TabsSettings/TabsCourse";
import TableSearchSelect from "../TableSearchSelect";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Course Name",
    accessor: "main_course__course_name",
    className: "table-cell w-10/12 md:w-3/12",
  },
  {
    header: "class",
    accessor: "specialty__main_specialty__specialty_name",
    className: "hidden md:table-cell w-2/12 md:w-2/12",
  },
  {
    header: "Level",
    accessor: "specialty__level__level",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Year",
    accessor: "specialty__academic_year",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Sem",
    accessor: "semester",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Lecturer",
    accessor: "assigned_to__full_name",
    className: "hidden md:table-cell w-2/12 md:w-2/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-2/12 md:w-1/12",
  },
];

const ListCoursePage = async ({ params, data, apiYears, lastYear }: { params: any, apiYears: any, data: GetCourseInter[] | any, lastYear: string }) => {

  const apiDomains: any[] = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true }, params.domain)
  const apiMainCourses: any[] = await getData(protocol + "api" + params.domain + GetMainCourseUrl, { nopage: true }, params.domain)
  const apiLevels: any[] = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true }, params.domain)

  const thisYear = new Date().getFullYear();

  const renderRow = (item: GetCourseInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.course_name}</td>
      <td className="hidden md:table-cell">{item.specialty_name}</td>
      <td className="hidden md:table-cell">{item.level}</td>
      <td className="hidden md:table-cell">{item.academic_year}</td>
      <td className="hidden md:table-cell">{item.semester}</td>
      <td className="hidden md:table-cell">{item.assigned_to_full_name}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="course" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} extra_data={
              { apiDomains: apiDomains, canEdit: true, apiMainCourses: apiMainCourses, apiLevel: apiLevels }
            } />
          </button>
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="course" type="delete" params={params} data={item} icon={<RiDeleteBin2Line />} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      <TabsCourse params={params} page={0} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Courses"} />
          <TableSearch placeholder="By Course Name" searchString="course_name" />
          <TableSearchSelect searchString="academic_year" data={apiYears.sort((a: string, b: string) => a[3] > b[3] ? -1 : a[3] < b[3] ? 1 : 0)} />
          <div className="hidden md:flex"><TableSearch placeholder="By Class" searchString="specialty_name" /></div>
          <div className="hidden md:flex"><TableSearch placeholder="By Level" searchString="level" /></div>
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-10">
              <FormModal table="course" type="create" params={params} icon={<FaPlus />} extra_data={{ apiDomains: apiDomains, apiMainCourses: apiMainCourses, apiLevels: apiLevels, canCreate: true }} />
            </button>
          </div>
        </div>
      </div>

      {lastYear ?
        <div key={lastYear} className="flex flex-col gap-2">
          <h1 className="text-center tracking-widest">{lastYear}</h1>
          <Table key={lastYear}
            columns={columns}
            renderRow={renderRow}
            data={data.filter((cou: GetCourseInter) => cou.academic_year == lastYear).sort((a: GetCourseInter, b: GetCourseInter) => a.level > b.level ? 1 : a.level < b.level ? -1 : 0)}
          />
        </div>

        :
        
        [`${thisYear}/${thisYear + 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear - 2}/${thisYear - 1}`,].map((year: string) =>
          <div key={year} className="flex flex-col gap-2">
            <h1 className="text-center tracking-widest">{year}</h1>
            <Table key={year}
              columns={columns}
              renderRow={renderRow}
              data={data.filter((cou: GetCourseInter) => cou.academic_year == year).sort((a: GetCourseInter, b: GetCourseInter) => a.level > b.level ? 1 : a.level < b.level ? -1 : 0)}
            />
          </div>
        )}
    </div>
  );
};

export default ListCoursePage;
