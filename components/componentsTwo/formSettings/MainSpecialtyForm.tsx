"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionDelete, ActionEdit } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SchemaCreateEditMainSpecialty } from "@/Domain/schemas/schemas";
import { GetFieldUrl, MainSpecialtyUrl } from "@/Domain/Utils-H/appControl/appConfig";
import SelectField from "../SelectField";
import { GetFieldInter, GetMainSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import { getData, handleResponseError } from "@/functions";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";

type Inputs = z.infer<typeof SchemaCreateEditMainSpecialty>;

const MainSpecialtyForm = ({
  type,
  data,
  setOpen,
  params,
}: {
  type: "create" | "update" | "delete";
  data: GetMainSpecialtyInter;
  setOpen?: any;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreateEditMainSpecialty),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0)
  const [fieldData, setFieldData] = useState<GetFieldInter[] | any>()
  useEffect(() => {
    if (count == 0) {
      const call = async () => {
        const response = await getData(protocol + "api" + params.domain + GetFieldUrl, { nopage: true, fieldList: ["id", "field_name"] }, params.domain)
        if (response && response.length) {
          if (type != "create" && data) {
            setFieldData(response.filter((item: GetFieldInter) => item.field_name != data.field_name))
          } else {
            setFieldData(response)
          }

        }
        setCount(1)

      }
      call()
    }
  }, [count, params, data, type])

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);

    const newVals = {
      specialty_name: formVals.specialty_name.toUpperCase(),
      specialty_name_short: formVals.specialty_name_short.toUpperCase(),
      field_id: formVals.field_id,
    }

    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newVals, SchemaCreateEditMainSpecialty, protocol + "api" + params.domain + MainSpecialtyUrl)
        const t = await handleResponseError(response, ["specialty_name", "specialty_short_name", "field_id"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/MainSpecialties?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newVals, data.id, SchemaCreateEditMainSpecialty, protocol + "api" + params.domain + MainSpecialtyUrl, params.domain)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/MainSpecialties?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + MainSpecialtyUrl, data.id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/MainSpecialties?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });


  console.log(data, 102)

  return (
    <form className="bg-slate-300 flex flex-col gap-4 p-2 rounded" onSubmit={onSubmit}>
      {type === "create" && <h1 className="font-semibold text-xl">Create Class Title</h1>}
      {type === "update" && <h1 className="font-semibold text-xl">Update Class Title</h1>}
      {type === "delete" && <h1 className="font-semibold text-xl">Delete Class Title</h1>}

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Class Title"
          name="specialty_name"
          defaultValue={data?.specialty_name}
          register={register}
          error={errors?.specialty_name}
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Short Class Name"
          name="specialty_name_short"
          defaultValue={data?.specialty_name_short}
          register={register}
          error={errors?.specialty_name_short}
        />
      </div>

      <SelectField
        label="Field"
        name="field_id"
        defaultValue={data?.field_id.toString()}
        defaultName={data?.field_name}
        register={register}
        error={errors?.field_id}
        data={fieldData}
        display={{ "name": "field_name", value: "id" }}
      />

      <MyButtonModal type={type} clicked={clicked} />

    </form>
  );
};

export default MainSpecialtyForm;
