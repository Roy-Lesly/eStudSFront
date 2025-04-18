"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionEdit, ActionDelete } from "@/serverActions/actionGeneral";
import { SchemaCreateEditSysCategory } from "@/Domain/schemas/schemas";
import { protocol } from "@/config";
import { SysCategoryUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { handleResponseError } from "@/functions";

type Inputs = z.infer<typeof SchemaCreateEditSysCategory>;

const SysCategoryForm = ({
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
    resolver: zodResolver(SchemaCreateEditSysCategory),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newData = {
      name: formVals["name"] ? formVals["name"].toUpperCase() : "",
    }

    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newData, SchemaCreateEditSysCategory, protocol  + "api" + params.domain + SysCategoryUrl )
        const t = await handleResponseError(response, ["name"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newData, data.id, SchemaCreateEditSysCategory, protocol  + "api" + params.domain + SysCategoryUrl, params.domain )
        if (response && response.id){
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol  + "api" + params.domain + SysCategoryUrl, data.id )
        if (response && response.success){
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {type === "create" && <h1 className="font-semibold text-xl">Create System Value Category</h1>}
      {type === "update" && <h1 className="font-semibold text-xl">Update Category</h1>}    
      {type === "delete" && <h1 className="font-semibold text-xl">Delete Category</h1>}    

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Category Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
      </div>

      <MyButtonModal type={type} clicked={clicked} />

    </form>
  );
};

export default SysCategoryForm;
