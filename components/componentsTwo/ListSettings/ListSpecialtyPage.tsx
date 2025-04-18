import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import { protocol } from "@/config";
import { TableRowClassName } from "@/constants";
import { AcademicYearUrl, GetLevelUrl, GetMainSpecialtyUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import { getData } from "@/functions";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import TabsSpecialty from "../TabsSettings/TabsSpecialty";
import TableSearchSelect from "../TableSearchSelect";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Class Name",
    accessor: "main_specialty__specialty_name",
    className: "table-cell w-3/12 md:w-6/12",
  },
  {
    header: "Year",
    accessor: "academic_year",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Level",
    accessor: "level__level",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Tuition",
    accessor: "tuition",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/12 md:w-1/12",
  },
];

const ListSpecialtyPage = async ({ params, data, apiYears, lastYear }: { params: any, data: GetSpecialtyInter[] | any, apiYears: string[], lastYear: string }) => {

  const apiMainSpecialty: any[] = await getData(protocol + "api" + params.domain + GetMainSpecialtyUrl, { nopage: true }, params.domain)
  const apiLevel: any[] = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true }, params.domain)
  const thisYear = new Date().getFullYear()

  const renderRow = (item: GetSpecialtyInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="table-cell">{item.specialty_name}</td>
      <td className="hidden md:table-cell">{item.academic_year}</td>
      <td className="hidden md:table-cell">{item.level}</td>
      <td className="hidden md:table-cell">{item.tuition}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="specialty" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} extra_data={[apiMainSpecialty, apiLevel, apiYears]} />
          </button>
          <button className="field-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="specialty" type="delete" params={params} data={item} icon={<RiDeleteBin2Line />} />
          </button>
        </div>
      </td>
    </tr>
  );

console.log(params, apiYears, lastYear, 79)
  return (
    <div className="bg-white flex-1 gap-2 m-2 mt-1 p-2 rounded-md text-black">

      <TabsSpecialty params={params} page={0} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Classes"} />
          <TableSearchSelect searchString="academic_year" data={apiYears.sort((a: string, b: string) => a[3] > b[3] ? -1 : a[3] < b[3] ? 1 : 0)} />
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            <button className="flex h-7 items-center justify-center rounded-full w-10">
              <FormModal table="specialty" type="create" params={params} icon={<FaPlus />} extra_data={[apiMainSpecialty, apiLevel, apiYears]} />
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
            data={data.filter((spec: GetSpecialtyInter) => spec.academic_year == lastYear).sort((a: GetSpecialtyInter, b: GetSpecialtyInter) => a.level > b.level ? -1 : a.level < b.level ? 1 : 0)}
          />
        </div>
        :
        [`${thisYear}/${thisYear + 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear - 2}/${thisYear - 1}`,].map((year: string) =>
          <div key={year} className="flex flex-col gap-2">
            <h1 className="text-center tracking-widest">{year}</h1>
            <Table key={year}
              columns={columns}
              renderRow={renderRow}
              data={data.filter((spec: GetSpecialtyInter) => spec.academic_year == year).sort((a: GetSpecialtyInter, b: GetSpecialtyInter) => a.level > b.level ? -1 : a.level < b.level ? 1 : 0)}
            />
          </div>
        )}

    </div>
  );
};

export default ListSpecialtyPage;
