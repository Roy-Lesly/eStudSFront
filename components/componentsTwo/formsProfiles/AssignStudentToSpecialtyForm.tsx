"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectField from "../SelectField";
import { ActionEdit } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { getData, handleResponseError } from "@/functions";
import { useEffect, useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { SchemaCreateEditUserProfile } from "@/schemas-user";
import {  UserProfileUrl } from "@/Domain/Utils-H/userControl/userConfig";
import { GetSpecialtyUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetDomainInter, GetLevelInter, GetSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import { GetProgramInter } from "@/Domain/Utils-H/userControl/userInter";


const SchemaUpdate = z.object({
  domain_id: z.coerce.number().optional(),
  academic_year: z.string().optional(),
  level_id: z.coerce.number().optional(),
  specialty_id: z.coerce.number().int(),
  program_id: z.coerce.number().int(),
  session: z.enum(["Morning", "Evening"]),
})

type Inputs = z.infer<typeof SchemaUpdate>;

const AssignStudentToSpecialtyForm = ({
  type,
  data,
  extra_data,
  setOpen,
  params,
}: {
  // type: "update" | "delete";
  type: "update" | "delete" | any;
  data?: any;
  extra_data?: {
    apiDomains: GetDomainInter[], apiLevels: GetLevelInter[], apiPrograms: GetProgramInter[]
  };
  setOpen?: any;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(SchemaUpdate),
  });

  const router = useRouter();
  const thisYear = new Date().getFullYear();
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState<boolean>(false);
  const [selectedDomainID, setSelectedDomainID] = useState<number>(0);
  const [selectedLevelID, setSelectedLevelID] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [specialtyData, setSpecialtyData] = useState<GetSpecialtyInter[] | any>()

  useEffect(() => {
    if (count == 1) {
      if (selectedDomainID && selectedLevelID && selectedYear.length > 0) {
        const call = async () => {
          const response = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, {
            nopage: true, school_id: params.school_id,
            "domain_id": selectedDomainID, "level_id": selectedLevelID, "academic_year": selectedYear,
          }, params.domain)
          if (response && response.length) {
            setSpecialtyData(response)
          } else {
            setSpecialtyData([])
          };
          setCount(3);
        }
        call()
      }
      setCount(3);
    }
  }, [count, params, selectedDomainID, selectedLevelID, selectedYear])

  const onSubmit = handleSubmit((formVals) => {

    setClicked(true);
    const newProfileData = {
      user_id: data.user__id,
      specialty_id: formVals.specialty_id,
      program_id: formVals.program_id,
      session: formVals.session,
    }

    if (type === "custom") {
      const call = async () => {
        const response = await ActionEdit({ ...newProfileData }, data.id, SchemaCreateEditUserProfile, protocol + "api" + params.domain + UserProfileUrl, params.domain)
        const t = await handleResponseError(response && response.error ? response.error : response, ["specialty_id", "program_id", "session", "user_id"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents?updated="SUCCESSFULLY ${new Date().getTime()}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {type === "custom" && <h1 className="font-semibold text-xl">Assign To Class</h1>}

        <div className="flex flex-wrap gap-4 justify-between">
          <SelectField
            label="Domain"
            name="domain_id"
            register={register}
            data={extra_data?.apiDomains}
            display={{ "name": "domain_name", value: "id" }}
            functions={[setCount, setSelectedDomainID, 1]}
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
              functions={[setCount, setSelectedYear, 1]}
            />
          </div> : <></>}

          {selectedYear ? <div className="flex flex-wrap gap-4 justify-between w-full">
            <SelectField
              label="Level"
              name="level_id"
              register={register}
              error={errors?.level_id}
              data={extra_data?.apiLevels}
              display={{ "name": "level", value: "id" }}
              functions={[setCount, setSelectedLevelID, 1]}
            />
          </div>
            :
            <></>}
        </div>

        {specialtyData && specialtyData.length && count == 3 ? <div className="flex flex-wrap gap-4 justify-between w-full">
          <SelectField
            label="Class"
            name="specialty_id"
            register={register}
            error={errors?.specialty_id}
            data={specialtyData}
            display={{ "name": "specialty_name", value: "id" }}
          />

          <div className="flex flex-row gap-2 justify-between md:gap-4 w-full">
            <SelectField
              label="Program"
              name="program_id"
              register={register}
              error={errors?.program_id}
              data={extra_data?.apiPrograms}
              display={{ "name": "name", value: "id" }}
            />
            <SelectField
              label="Session"
              name="session"
              defaultValue={data?.session}
              register={register}
              error={errors?.session}
              data={["Morning", "Evening"]}
            />
          </div>

        </div> : <></>}

        {specialtyData && specialtyData.length && count == 3 ? <MyButtonModal type={"Assign"} clicked={clicked} /> : <></>}

      </form>
    </>
  );
};

export default AssignStudentToSpecialtyForm;
