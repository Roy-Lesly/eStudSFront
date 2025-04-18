"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionDelete, ActionEdit } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { CourseUrl, GetSpecialtyUrl } from "@/Domain/Utils-H/appControl/appConfig";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { useEffect, useState } from "react";
import { GetDomainInter, GetLevelInter, GetMainCourseInter, GetSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import { getData, handleResponseError } from "@/functions";
import SelectField from "../SelectField";
import { SchemaCreateEditCourse } from "@/Domain/schemas/schemas";
import { GetCustomUserInter } from "@/Domain/Utils-H/userControl/userInter";
import { GetCustomUserUrl } from "@/Domain/Utils-H/userControl/userConfig";
import MyButtonLink from "@/section-h/common/MyButtons/MyButtonLink";

type Inputs = z.infer<typeof SchemaCreateEditCourse>;

const CourseForm = ({
  type,
  data,
  extra_data,
  setOpen,
  params,
}: {
  type: "create" | "update" | "delete";
  data?: any;
  extra_data?: { apiDomains: GetDomainInter[], apiMainCourses: GetMainCourseInter[] | any, apiLevels: GetLevelInter[], canCreate?: boolean, canEdit?: boolean, canDelete?: boolean };
  setOpen?: any;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreateEditCourse),
  });

  const thisYear = new Date().getFullYear()
  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0)
  const [specialtyData, setSpecialtyData] = useState<GetSpecialtyInter[] | any>()
  const [lecturerData, setLecturerData] = useState<GetCustomUserInter[] | any>()
  const [selectedDomainID, setSelectedDomainID] = useState<number>(0)
  const [selectedLevelID, setSelectedLevelID] = useState<number>(0)
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<GetSpecialtyInter>()

  useEffect(() => {
    if (count == 0 && data && data.specialty_id) {
      const call = async () => {
        const responseLecturer = await getData(protocol + "api" + params.domain + GetCustomUserUrl, { nopage: true, role: "teacher", active: true, is_staff: false, school_id: params.school_id, }, params.domain)
        const responseAdmin = await getData(protocol + "api" + params.domain + GetCustomUserUrl, { nopage: true, role: "admin", active: true, is_staff: false, school_id: params.school_id, }, params.domain)
        const response = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { "domain_id": data.domain_id, "academic_year": data.academic_year, nopage: true, }, params.domain)
          if (response && response.length) {
          setSpecialtyData(response)
        }
        if (responseLecturer && responseAdmin) {
          setLecturerData([...responseAdmin, ...responseLecturer])
        }
        setCount(1);
      }
      call()
    }
    if (count == 0 && !data && extra_data?.canCreate) {
      const call = async () => {
        const responseLecturer = await getData(protocol + "api" + params.domain + GetCustomUserUrl, { nopage: true, role: "teacher", active: true, is_staff: false, school_id: params.school_id }, params.domain)
        const responseAdmin = await getData(protocol + "api" + params.domain + GetCustomUserUrl, { nopage: true, role: "admin", active: true, is_staff: false, school_id: params.school_id }, params.domain)
        if (responseLecturer && responseAdmin) {
          setLecturerData([...responseAdmin, ...responseLecturer])
        }
        setCount(1);
      }
      call()
    }
    if (count == 3 && selectedDomainID && selectedLevelID && selectedYear.length > 0) {
      const call = async () => {
        const response = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, {
          "domain_id": selectedDomainID, "level_id": selectedLevelID, "academic_year": selectedYear, nopage: true, }, params.domain)
        if (response && response.length) {
          setSpecialtyData(response)
        }
        setCount(1);
      }
      call()
    }
  }, [count, params, data, type, selectedDomainID, extra_data, selectedLevelID, selectedYear])

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);

    const newVals = {
      school_id: params.school_id,
      main_course_id: formVals.main_course_id,
      specialty_id: formVals.specialty_id,
      course_code: formVals.course_code,
      course_credit: formVals.course_credit,
      course_type: formVals.course_type,
      hours: formVals.hours,
      hours_left: formVals.hours,
      semester: formVals.semester,
      assigned_to_id: formVals.assigned_to_id,
      assigned: formVals.assigned_to_id ? true : false,
      paid: false,
      completed: false,

    }


    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newVals, SchemaCreateEditCourse, protocol + "api" + params.domain + CourseUrl)
        const t = await handleResponseError(response, ["school_id", "course_type", "hours", "hours_left", "main_course_id", "specialty_id", "course_code", "semester", "assigned_to_id", "paid", "completed"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newVals, data.id, SchemaCreateEditCourse, protocol + "api" + params.domain + CourseUrl, params.domain)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + CourseUrl, data.id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <>
      {lecturerData ?
        lecturerData.length ?
          <>
          {type === "create" ? <form className="bg-slate-300 flex flex-col gap-1 md:gap-4 p-2 text-black" onSubmit={onSubmit}>
            {type === "create" && <h1 className="font-semibold text-xl">Assign Course</h1>}

            <div className="flex flex-wrap gap-4 justify-between">
              <SelectField
                label="Domain"
                name="domain_id"
                register={register}
                error={errors?.domain_id}
                data={extra_data?.apiDomains}
                defaultValue={data?.domain_id}
                defaultName={data?.assigned_to_full_name}
                display={{ "name": "domain_name", value: "id" }}
                functions={[setCount, setSelectedDomainID, 3]}
              />
            </div>

            <div className="flex flex-row gap-2 justify-between md:gap-4 w-full">
              {selectedDomainID ? <div className="flex flex-wrap gap-4 justify-between w-full">
                <SelectField
                  label="Year"
                  name="academic_year"
                  register={register}
                  error={errors?.academic_year}
                  data={[`${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`]}
                  functions={[setCount, setSelectedYear, 3]}
                />
              </div> : <></>}

              {selectedYear ? <div className="flex flex-wrap gap-4 justify-between w-full">
                <SelectField
                  label="Level"
                  name="level_id"
                  register={register}
                  error={errors?.level}
                  data={extra_data?.apiLevels}
                  display={{ "name": "level", value: "id" }}
                  functions={[setCount, setSelectedLevelID, 3]}
                />
              </div>
                :
                <></>}
            </div>

            {specialtyData ? <div className="flex flex-wrap gap-4 justify-between w-full">
              <SelectField
                label="Class"
                name="specialty_id"
                register={register}
                error={errors?.specialty_id}
                data={specialtyData}
                display={{ "name": "specialty_name", value: "id" }}
                functions={[setCount, setSelectedSpecialty, 3]}
              />
            </div> : <></>}


            {specialtyData ? <div className="flex flex-col gap-2 w-full">

              <SearchMainCourse
                apiMainCourse={extra_data?.apiMainCourses}
                data={data}
                error={errors?.main_course_id}
                defaultName={data?.course_name}
                defaultValue={data?.main_course_id}
                name={"main_course_id"}
                register={register}
              />


              <div className="flex flex-row gap-2">
                <InputField
                  label="Code"
                  name="course_code"
                  defaultValue={data?.course_code}
                  register={register}
                  error={errors?.course_code}
                />
                <InputField
                  label="Credit"
                  name="course_credit"
                  defaultValue={data?.course_credit}
                  register={register}
                  error={errors?.course_credit}
                  type="number"
                />
                <SelectField
                  label="Semester"
                  name="semester"
                  register={register}
                  error={errors?.semester}
                  data={["I", "II"]}
                />
              </div>

              <div className="flex gap-2 md:flex-row">
                <InputField
                  label="Hours"
                  name="hours"
                  defaultValue={data?.hours}
                  register={register}
                  error={errors?.hours}
                  type="number"
                />
                <SelectField
                  label="Course Type"
                  name="course_type"
                  register={register}
                  error={errors?.course_type}
                  defaultValue={data?.course_type}
                  defaultName={data?.course_type}
                  data={["Transversal", "Fundamental", "Professional"]}
                />
              </div>
              <div className="flex flex-col gap-2 md:flex-row">
                <SearchLecturer
                  apiLecturer={lecturerData}
                  data={data}
                  register={register}
                  defaultValue={data?.assigned_to_id}
                  defaultName={data?.assigned_to_full_name}
                  name={"assigned_to_id"}
                />
              </div>

              {extra_data?.canCreate ? <div className="flex items-center justify-center md:mt-6 mt-4 w-full">
                <MyButtonModal type={type} clicked={clicked} />
              </div> : <></>}

            </div> : <></>}


          </form>
          

          
          :



          // UPDATE AND DELETE SECTION
          <form className="bg-slate-300 flex flex-col gap-1 md:gap-4 p-2 rounded-lg" onSubmit={onSubmit}>
            {type === "update" && <h1 className="font-semibold text-xl">Update Course</h1>}
            {type === "delete" && <h1 className="font-semibold text-xl">Delete Course</h1>}

            <div className="flex flex-wrap gap-4 justify-between">
              <SelectField
                label="Domain"
                name="domain_id"
                register={register}
                error={errors?.domain_id}
                data={extra_data?.apiDomains}
                defaultValue={data?.domain_id}
                defaultName={data?.domain_name}
                display={{ "name": "domain_name", value: "id" }}
                functions={[setCount, setSelectedDomainID, 3]}
              />
            </div>

            {specialtyData ? <div className="flex flex-wrap gap-4 justify-between w-full">
              <SelectField
                label="Class"
                name="specialty_id"
                register={register}
                error={errors?.specialty_id}
                defaultValue={data?.specialty_id}
                defaultName={data?.specialty_name}
                data={specialtyData}
                display={{ "name": "main_specialty__specialty_name", value: "id" }}
                functions={[setCount, setSelectedSpecialty, 3]}
              />
            </div> : <></>}


            {specialtyData ? <div className="flex flex-col gap-2 w-full">

              <SelectField
                label="Course Title"
                name={"main_course_id"}
                register={register}
                error={errors?.main_course_id}
                defaultValue={data?.main_course_id}
                defaultName={data?.course_name}
                data={extra_data?.apiMainCourses}
                display={{ "name": "course_name", value: "id" }}
              />


              <div className="flex flex-row gap-2">
                <InputField
                  label="Code"
                  name="course_code"
                  defaultValue={data?.course_code}
                  register={register}
                  error={errors?.course_code}
                />
                <InputField
                  label="Credit"
                  name="course_credit"
                  defaultValue={data?.course_credit}
                  register={register}
                  error={errors?.course_credit}
                  type="number"
                />
                <SelectField
                  label="Semester"
                  name="semester"
                  register={register}
                  defaultValue={data?.semester}
                  error={errors?.semester}
                  data={["I", "II"]}
                />
              </div>

              <div className="flex gap-2 md:flex-row">
                <InputField
                  label="Hours"
                  name="hours"
                  defaultValue={data?.hours}
                  register={register}
                  error={errors?.hours}
                  type="number"
                />
                <SelectField
                  label="Course Type"
                  name="course_type"
                  register={register}
                  error={errors?.course_type}
                  defaultValue={data?.course_type}
                  defaultName={data?.course_type}
                  data={["Transversal", "Fundamental", "Professional"]}
                />
              </div>
              {extra_data?.canEdit ?<div className="flex flex-col gap-2 md:flex-row">
                <SelectField
                  label="Lecturer"
                  name={"assigned_to_id"}
                  register={register}
                  error={errors?.assigned_to_id}
                  defaultValue={data?.assigned_to_id}
                  defaultName={data?.assigned_to_full_name}
                  data={lecturerData}
                  display={{ "name": "full_name", value: "id" }}
                />
              </div> : <></>}

              {extra_data?.canEdit ? <div className="flex items-center justify-center md:mt-6 mt-4 w-full">
                <MyButtonModal type={type} clicked={clicked} />
              </div> : <></>}

            </div> : <></>}


          </form>}
          </>
          :
          <div className="flex flex-col gap-4 items-center justify-center p-20 w-full">
            <h1>No Lecturer Registered</h1>
            <MyButtonLink title={"Goto Lecturers Page"} clicked={clicked} href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageLecturers`} />
          </div>
        :
        <div className="bg-white dark:bg-black flex items-center justify-center py-20">
          <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-16 rounded-full w-16"></div>
        </div>
      }

    </>
  );
};

export default CourseForm;

const SearchLecturer = ({ apiLecturer, data, register, name }: any) => {
  const [newData, setNewData] = useState<GetCustomUserInter[]>(apiLecturer);
  const onSearch = (text: string) => {
    if (text.length > 2) {
      const fil = apiLecturer.filter((item: GetCustomUserInter) => item.full_name.toLowerCase().includes(text.toLowerCase()))
      setNewData(fil)
    }
    else { setNewData(apiLecturer) }
  }

  return (
    <div className="col-span-2 flex-col items-center justify-center md:flex mx-0 px-0 w-full">
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search Lecturer"
        className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-2 py-1 rounded-lg text-black transition w-full"
      />
      <select
        {...register(name)}
        name="assigned_to_id" defaultValue={data?.assigned_to_id} className='border-2 px-1 py-1 rounded w-full'>
        <option value={0}>------------------</option>
        {newData && newData.map((item: GetCustomUserInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
          {item.full_name.slice(0, 20)}
        </option>)
        )}
      </select>
    </div>
  )
}
const SearchMainCourse = ({ apiMainCourse, data, error, register, name }: any) => {
  const [newData, setNewData] = useState<GetMainCourseInter[]>(apiMainCourse);
  const onSearch = (text: string) => {
    if (text.length > 2) {
      const fil = apiMainCourse.filter((item: GetMainCourseInter) => item.course_name.toLowerCase().includes(text.toLowerCase()))
      setNewData(fil)
    }
    else { setNewData(apiMainCourse) }
  }

  return (
    <div className="col-span-2 flex-col items-center justify-center md:flex mx-0 px-0 w-full">
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search Course Title"
        className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-2 py-1 rounded-lg text-black transition w-full"
      />
      <select
        {...register(name)}
        name="main_course_id" defaultValue={data?.main_course_id} className='border-2 px-1 py-1 rounded w-full'>
        <option value={0}>------------------</option>
        {newData && newData.map((item: GetMainCourseInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
          {item.course_name.slice(0, 20)}
        </option>)
        )}
      </select>
      {error?.message && (
        <p className="font-medium text-red text-xs">{error.message.toString()}</p>
      )}
    </div>
  )
}

