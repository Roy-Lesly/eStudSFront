"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionDelete, ActionEdit } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { ProgramUrl } from "@/Domain/Utils-H/userControl/userConfig";
import { useState } from "react";
import { SchemaCreateEditProgram } from "@/Domain/schemas/schemas";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { handleResponseError } from "@/functions";

type Inputs = z.infer<typeof SchemaCreateEditProgram>;

const ProgramForm = ({
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
    resolver: zodResolver(SchemaCreateEditProgram),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);

    const newVals = {
      name: formVals.name.toUpperCase(),
      description: formVals.description,
    }

    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newVals, SchemaCreateEditProgram, protocol + "api" + params.domain + ProgramUrl)
        const t = await handleResponseError(response, ["name"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newVals, data.id, SchemaCreateEditProgram, protocol + "api" + params.domain + ProgramUrl, params.domain)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + ProgramUrl, data.id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <form className="bg-slate-300 flex flex-col gap-4 p-2 rounded" onSubmit={onSubmit}>
      {type === "create" && <h1 className="font-semibold text-xl">Create Program</h1>}
      {type === "update" && <h1 className="font-semibold text-xl">Update Program</h1>}
      {type === "delete" && <h1 className="font-semibold text-xl">Delete Program</h1>}

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Program Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
      </div>

      <MyButtonModal type={type} clicked={clicked} />

    </form>
  );
};

export default ProgramForm;
