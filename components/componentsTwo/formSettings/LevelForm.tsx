"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionDelete, ActionEdit } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { useState } from "react";
import { SchemaCreateEditLevel } from "@/Domain/schemas/schemas";
import { LevelUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { handleResponseError } from "@/functions";

type Inputs = z.infer<typeof SchemaCreateEditLevel>;

const LevelForm = ({
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
    resolver: zodResolver(SchemaCreateEditLevel),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true)


    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(formVals, SchemaCreateEditLevel, protocol  + "api" + params.domain + LevelUrl )
        const t = await handleResponseError(response, ["level"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(formVals, data.id, SchemaCreateEditLevel, protocol  + "api" + params.domain + LevelUrl, params.domain )
        if (response && response.id){
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol  + "api" + params.domain + LevelUrl, data.id )
        if (response && response.success){
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <form className="bg-slate-300 flex flex-col gap-4 p-2 rounded" onSubmit={onSubmit}>
      {type === "create" && <h1 className="font-semibold text-xl">Create Level</h1>}
      {type === "update" && <h1 className="font-semibold text-xl">Update Level</h1>}    
      {type === "delete" && <h1 className="font-semibold text-xl">Delete Level</h1>}    

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Level"
          name="level"
          defaultValue={data?.level}
          register={register}
          error={errors?.level}
        />
      </div>

      <MyButtonModal type={type} clicked={clicked} />

    </form>
  );
};

export default LevelForm;
