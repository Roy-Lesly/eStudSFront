"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionDelete, ActionEdit } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { FieldUrl, GetDomainUrl } from "@/Domain/Utils-H/appControl/appConfig";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { useEffect, useState } from "react";
import { SchemaCreateEditField } from "@/Domain/schemas/schemas";
import { GetDomainInter } from "@/Domain/Utils-H/appControl/appInter";
import { getData, handleResponseError } from "@/functions";
import SelectField from "../SelectField";

type Inputs = z.infer<typeof SchemaCreateEditField>;

const FieldForm = ({
  type,
  data,
  setOpen,
  params,
}: {
  type: "create" | "update" | "delete";
  data?: any;
  setOpen?: any;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreateEditField),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0)
  const [domData, setDomData] = useState<GetDomainInter[] | any>()

  useEffect(() => {
    if (count == 0) {
      const call = async () => {
        const response = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true }, params.domain)
        if (response && response.length) {
          if (type != "create" && data) {
            setDomData(response.filter((item: GetDomainInter) => item.domain_name != data.domain_name))
          } else {
            setDomData(response)
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
      field_name: formVals.field_name.toUpperCase(),
      domain_id: formVals.domain_id,
    }

    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newVals, SchemaCreateEditField, protocol + "api" + params.domain + FieldUrl)
        const t = await handleResponseError(response, ["field_name", "domain_id"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newVals, data.id, SchemaCreateEditField, protocol + "api" + params.domain + FieldUrl, params.domain)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + FieldUrl, data.id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <form className="bg-slate-300 flex flex-col gap-4 p-2 rounded" onSubmit={onSubmit}>
      {type === "create" && <h1 className="font-semibold text-xl">Create Field</h1>}
      {type === "update" && <h1 className="font-semibold text-xl">Update Field</h1>}
      {type === "delete" && <h1 className="font-semibold text-xl">Delete Field</h1>}

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Field Name"
          name="field_name"
          defaultValue={data?.field_name}
          register={register}
          error={errors?.field_name}
        />
        <SelectField
          label="Domain"
          name="domain_id"
          defaultValue={data?.domain_id}
          defaultName={data?.domain_name}
          register={register}
          error={errors?.domain_id}
          data={domData}
          display={{ "name": "domain_name", value: "id" }}
        />
      </div>

      <MyButtonModal type={type} clicked={clicked} />

    </form>
  );
};

export default FieldForm;
