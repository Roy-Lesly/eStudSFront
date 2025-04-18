"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { ActionEdit, ActionDelete } from "@/serverActions/actionGeneral";
import { ConfigData, protocol } from "@/config";
import { useRouter } from "next/navigation";
import { getData, handleResponseError } from "@/functions";
import { useEffect, useState } from "react";
import { AcademicYearUrl } from "@/Domain/Utils-H/appControl/appConfig";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { SchemaCreateEditCustomUser } from "@/schemas-user";
import { CustomUserUrl, GetDepartmentUrl } from "@/Domain/Utils-H/userControl/userConfig";
import Link from "next/link";
import MultipleSelectField from "../ListSettings/MultipleSelectField";
import { GetDepartmentInter } from "@/Domain/Utils-H/userControl/userInter";

const SchemaCreate = z.object({
  first_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
  last_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
  sex: z.enum(["Male", "Female"]),
  email: z.string().email(),
  telephone: z.coerce.number().int().gte(610000000).lte(699999999),
  title: z.enum(["Prof", "Dr", "Mr", "Mrs", "Miss", "Engr"]).optional(),
  address: z.string().optional(),
  pob: z.string().optional(),
  dob: z.string().optional(),
  is_active: z.enum(["true", "false"]),
  school: z.array(z.number().optional()).optional(),
})

type Inputs = z.infer<typeof SchemaCreate>;

const UsersForm = ({
  type,
  data,
  extra_data,
  setOpen,
  params,
}: {
  // type: "update" | "delete";
  type: "update" | "delete" | any;
  data?: any;
  extra_data?: any;
  setOpen?: any;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter();
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState<boolean>(false);
  const [apiYears, setApiYears] = useState<string[]>();
  const [dept, setDept] = useState<GetDepartmentInter | any>();

  useEffect(() => {
    if (count == 0) {
      var getYears = async () => {
        var res = await getData(protocol + "api" + params.domain + AcademicYearUrl, {}, params.domain)
        var resDept = await getData(protocol + "api" + params.domain + GetDepartmentUrl, { nopage: true }, params.domain)
        if (res && res.count) {
          if (data && data.year) { setApiYears(res.results.filter((item: string) => item != data.year)) }
          else { setApiYears(res.results) }
        };
        if (resDept && resDept.count) { setDept(resDept.results) }
        else { setDept([]) };
        setCount(1)
      }
      getYears()
    }
  }, [count, params, data])

  const onSubmit = handleSubmit((formVals) => {

    // const t = getValues("school")

    setClicked(true);
    const newData = {
      username: formVals.first_name?.toString().toUpperCase(),
      first_name: formVals.first_name?.toString().toUpperCase(),
      last_name: formVals.last_name?.toString().toUpperCase(),
      full_name: formVals.first_name?.toString().toUpperCase() + " " + formVals.last_name?.toString().toUpperCase(),
      telephone: formVals.telephone,
      title: formVals.title,
      email: formVals.email,
      pob: formVals.pob,
      dob: formVals.dob,
      sex: formVals.sex,
      is_active: formVals.is_active == "true" ? true : false ,
      prefix: ConfigData[params.domain]["higher"].prefix,
      dept: [parseInt(dept[0].id)],
      school: [parseInt(params.school_id)],
      role: extra_data[0],
    }

    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newData, data.id, SchemaCreateEditCustomUser, protocol + "api" + params.domain + CustomUserUrl, params.domain)
        const t = await handleResponseError(response, ["username", "telephone", "email", "full_name", "dob"]);
        if (t == "" && response && response.id) {
          if (extra_data[0] == "admin") router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers?updated="SUCCESSFULLY ${new Date().getTime()}) !!!`);
          if (extra_data[0] == "teacher") router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers/Lecturers?updated="SUCCESSFULLY ${new Date().getTime()}) !!!`);
          if (extra_data[0] == "student") router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers/Students?updated="SUCCESSFULLY ${new Date().getTime()}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      setOpen(false);
      setClicked(false)
      // if (extra_data[0] == "admin") router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers?deleted="Not Permitted !!! ${new Date().getTime()}) !!!`);
      // if (extra_data[0] == "teacher") router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers/Lecturers?deleted="Not Permitted !!! ${new Date().getTime()}) !!!`);
      // if (extra_data[0] == "student") router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers/Students?deleted="Not Permitted !!! ${new Date().getTime()}) !!!`);
      return
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + CustomUserUrl, data.id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <>
      {dept ?
        dept.length ?
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            {type === "update" && <h1 className="font-semibold text-xl">Update User</h1>}
            {type === "delete" && <h1 className="font-semibold text-xl">Delete User</h1>}

            <div className="flex flex-wrap gap-4 justify-between">
              <InputField
                label="Username"
                name="username"
                className={type === "update" ? "hidden" : "flex"}
                defaultValue={data?.username}
                readOnly={type != "update" ? true : false}
                register={register}
              />

              <div className="flex gap-2 w-full">
                <InputField
                  label="First Name"
                  name="first_name"
                  defaultValue={data?.first_name}
                  register={register}
                  error={errors?.first_name}
                />
                <InputField
                  label="Last Name"
                  name="last_name"
                  defaultValue={data?.last_name}
                  register={register}
                  error={errors?.last_name}
                />
              </div>

              <div className="flex gap-2 w-full">
                <InputField
                  label="Telephone Number"
                  name="telephone"
                  defaultValue={data?.telephone}
                  register={register}
                  error={errors?.telephone}
                  type="number"
                />
                <SelectField
                  label="Gender"
                  name="sex"
                  defaultValue={data?.sex}
                  register={register}
                  error={errors?.sex}
                  data={["Male", "Female"]}
                />
              </div>

              <InputField
                label="Email"
                name="email"
                defaultValue={data?.email}
                register={register}
                error={errors?.email}
              />
              <SelectField
                  label="Active"
                  name="is_active"
                  defaultValue={data?.is_active === "True" ? "true" : "false"}
                  defaultName={data?.is_active === "True" ? "Active" : "Inactive"}
                  register={register}
                  error={errors?.is_active}
                  display={{ name: "name", value: "id"}}
                  data={[ {name: "Active", id: "true"}, {name: "Inactive", id: "false"} ]}
                />

              <div className="flex gap-2 w-full">
                {extra_data[0] != "student" && <SelectField
                  label="Title"
                  name="title"
                  defaultValue={data?.title}
                  register={register}
                  error={errors?.title}
                  data={["Prof", "Dr", "Mr", "Mrs", "Miss", "Engr"]}
                />}
                {/* {type === "update" && <MultipleSelectField
                  label="Campus"
                  name="school"
                  defaultValue={data?.school__id}
                  register={register}
                  error={errors?.school}
                  data={["Prof", "Dr", "Mr", "Mrs", "Miss", "Engr"]}
                />} */}
              </div>

              <div className="flex gap-2 w-full">
                <InputField
                  label="Place Of Birth"
                  name="pob"
                  defaultValue={data?.pob}
                  register={register}
                  error={errors?.pob}
                />
                <InputField
                  label="Date Of Birth"
                  name="dob"
                  defaultValue={data?.dob}
                  register={register}
                  error={errors?.dob}
                  type="date"
                />
              </div>
            </div>


            <MyButtonModal type={type} clicked={clicked} />

          </form>
          :
          <div className="flex flex-col gap-4 h-full items-center justify-center w-full">
            <div>No Department</div>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/Department`} className="border px-6 py-2 rounded">Goto Departments</Link>
          </div>
        :
        <div className="bg-white dark:bg-black flex h-full items-center justify-center py-10">
          <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-16 rounded-full w-16"></div>
        </div>

      }
    </>
  );
};

export default UsersForm;
