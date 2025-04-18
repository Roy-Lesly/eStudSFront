"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectField from "../SelectField";
import { ActionCreate, ActionEdit } from "@/serverActions/actionGeneral";
import { ConfigData, protocol } from "@/config";
import { useRouter } from "next/navigation";
import { getData, handleResponseError } from "@/functions";
import { useEffect, useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { SchemaCreateEditCustomUser, SchemaCreateEditPreIncription, SchemaCreateEditUserProfile } from "@/schemas-user";
import { CustomUserUrl, GetDepartmentUrl, PreInscriptionUrl, UserProfileUrl } from "@/Domain/Utils-H/userControl/userConfig";
import { GetSpecialtyUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetDomainInter, GetLevelInter, GetSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import { GetDepartmentInter, GetPreInscriptionInter, GetProgramInter } from "@/Domain/Utils-H/userControl/userInter";


const SchemaCreate = z.object({
  domain_id: z.coerce.number().optional(),
  academic_year: z.string().optional(),
  level_id: z.coerce.number().optional(),
  specialty_id: z.coerce.number().int(),
  program_id: z.coerce.number().int(),
  session: z.enum(["Morning", "Evening"]),
})

type Inputs = z.infer<typeof SchemaCreate>;

const AdmitStudentFromPreInscriptionForm = ({
  type,
  data,
  extra_data,
  setOpen,
  params,
}: {
  type: "update" | "delete" | any;
  data: GetPreInscriptionInter;
  extra_data: { apiLevels: GetLevelInter[], apiDomains: GetDomainInter[], apiDepartments: GetDepartmentInter[], apiPrograms: GetProgramInter[], apiYears: string[] };
  setOpen?: any;
  params?: any;
}) => {

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter();
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState<boolean>(false);
  const [selectedDomainID, setSelectedDomainID] = useState<number>(0);
  const [selectedLevelID, setSelectedLevelID] = useState<number>(extra_data.apiLevels.filter((item: GetLevelInter) => item.level == data.level)[0].id);
  const [selectedYear, setSelectedYear] = useState<string>(extra_data.apiYears.filter((item: string) => item == data.academic_year)[0]);
  const [specialtyData, setSpecialtyData] = useState<GetSpecialtyInter[] | any>()


  useEffect(() => {
    if (count == 1) {
      if (selectedDomainID && selectedLevelID && selectedYear.length > 1) {
        const getSpecialties = async () => {
          const response = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, {
            nopage: true, school_id: params.school_id,
            "domain_id": selectedDomainID, "level_id": selectedLevelID, "academic_year": selectedYear,
          }, params.domain)
          if (response && response.length) {
            setSpecialtyData(response)
          } else {
            setSpecialtyData([])
          };
          setCount(2);
        }
        getSpecialties()
      }
    }
  }, [count, params, selectedDomainID, selectedLevelID, selectedYear])



  const onSubmit = handleSubmit((formVals) => {

    if (data && formVals.specialty_id && formVals.program_id) {
      // setClicked(true);
      const newUserData = {
        matricle: data.academic_year.slice(2, 4),
        username: data.academic_year.slice(2, 4),
        first_name: data.first_name,
        last_name: data.last_name,
        sex: data.sex,
        dob: data.dob,
        pob: data.pob,
        address: data.address,
        telephone: data.telephone,
        email: data.email,
        prefix: ConfigData[params.domain]["higher"].method + formVals.academic_year?.slice(2, 4) + ConfigData[params.domain]["higher"].prefix,
        dept: [parseInt(extra_data.apiDepartments[0].id.toString())],
        school: [parseInt(params.school_id)],
        role: "student",
      }
      const newProfileData = {
        specialty_id: formVals.specialty_id,
        program_id: formVals.program_id,
        session: formVals.session,
      }

      if (type === "custom") {
        const call = async () => {
          const response1 = await ActionCreate(newUserData, SchemaCreateEditCustomUser, protocol + "api" + params.domain + CustomUserUrl)
          const t = await handleResponseError(response1, ["username", "telephone", "sex", "email", "full_name", "dob"]);
          if (t == "" && response1 && response1.id) {
            const response2 = await ActionCreate({ ...newProfileData, user_id: response1.id }, SchemaCreateEditUserProfile, protocol + "api" + params.domain + UserProfileUrl)
            if (response2 && response2.id) {
              console.log(response2)
              const response3 = await ActionEdit({ ...data, status: "ADMITTED", action: "ADMISSION", admission_status: true }, data.id, SchemaCreateEditPreIncription, protocol + "api" + params.domain + PreInscriptionUrl, params.domain)
              console.log(response3, 3)
              if (response3 && response3.id) {
                router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${response2.id}/Fees?created="SUCCESSFULLY (${response3.id}) !!!`);
              }
              setOpen(false)
            }
          }
          setClicked(false)
        }
        call()
      }
    }

  });

  return (
    <>
      <form className="bg-slate-200 flex flex-col gap-2 p-2 rounded" onSubmit={onSubmit}>
        {type === "custom" && <h1 className="font-semibold text-xl tracking-widest">Admit Student To Class</h1>}

        <div className="bg-white flex font-semibold gap-2 justify-center p-2 rounded text-blue-800 text-lg tracking-widest w-full">
          <span>{data.full_name}</span>
        </div>
        <div className="flex flex-row gap-2 justify-between md:gap-4 w-full">
          <SelectField
            label="Program"
            name="program_id"
            register={register}
            error={errors?.program_id}
            defaultName={data?.program}
            defaultValue={extra_data.apiPrograms.filter((item: GetProgramInter) => item.name == data?.program)[0].id.toString()}
            data={extra_data.apiPrograms}
            display={{ "name": "name", value: "id" }}
          />
          <SelectField
            label="Session"
            name="session"
            defaultValue={data?.session}
            defaultName={data?.session}
            register={register}
            error={errors?.session}
            data={["Morning", "Evening"]}
          />
        </div>

        <div className="flex flex-row gap-2 justify-between md:gap-4 w-full">
          <SelectField
            label="Year"
            name="academic_year"
            register={register}
            error={errors?.academic_year}
            data={extra_data.apiYears}
            defaultValue={selectedYear}
            functions={[setCount, setSelectedYear, 1]}
          />
          <SelectField
            label="Level"
            name="level_id"
            register={register}
            error={errors?.level_id}
            defaultName={data.level.toString()}
            defaultValue={selectedLevelID.toString()}
            data={extra_data.apiLevels}
            display={{ "name": "level", value: "id" }}
            functions={[setCount, setSelectedLevelID, 1]}
          />
        </div>


        <div className="bg-white flex flex-col gap-2 p-2 rounded w-full">
          <div className="flex flex-row gap-2 justify-between md:gap-4 w-full">
            <span className="flex items-center text-[14px] w-1/3">1st Choice</span>
            <span className="flex font-medium italic items-center justify-center text-center w-2/3">{data.specialty_one}</span>
          </div>
          <div className="flex flex-row gap-2 justify-between md:gap-4 w-full">
            <span className="flex items-center text-[14px] w-1/3">2nd Choice</span>
            <span className="flex font-medium italic items-center justify-center text-center w-2/3">{data.specialty_two}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-between">
          <SelectField
            label="Domain"
            name="domain_id"
            register={register}
            error={errors?.domain_id}
            data={extra_data.apiDomains}
            display={{ "name": "domain_name", value: "id" }}
            functions={[setCount, setSelectedDomainID, 1]}
          />
        </div>

        {specialtyData && specialtyData.length ? <div className="flex flex-wrap gap-4 justify-between w-full">
          <SelectField
            label="Class"
            name="specialty_id"
            register={register}
            error={errors?.specialty_id}
            data={specialtyData}
            display={{ "name": "specialty_name", value: "id" }}
            functions={[setCount, () => { }, 3]}
          />

        </div> : <></>}

        {specialtyData && specialtyData.length && count == 3 ? <MyButtonModal type={"create"} title="Admit" clicked={clicked} /> : <></>}

      </form>
    </>
  );
};

export default AdmitStudentFromPreInscriptionForm;
