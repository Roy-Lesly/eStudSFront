"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionDelete, ActionEdit } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { DepartmentUrl } from "@/Domain/Utils-H/userControl/userConfig";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { useState } from "react";
import { SchemaCreateEditDepartment } from "@/Domain/schemas/schemas";

type Inputs = z.infer<typeof SchemaCreateEditDepartment>;

const DepartmentForm = ({
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
    resolver: zodResolver(SchemaCreateEditDepartment),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true)


    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(formVals, SchemaCreateEditDepartment, protocol  + "api" + params.domain + DepartmentUrl )
        if (response && response.id){
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/Department?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(formVals, data.id, SchemaCreateEditDepartment, protocol  + "api" + params.domain + DepartmentUrl, params.domain)
        if (response && response.id){
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/Department?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol  + "api" + params.domain + DepartmentUrl, data.id )
        if (response && response.success){
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/Department?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {type === "create" && <h1 className="font-semibold text-xl">Create Department</h1>}
      {type === "update" && <h1 className="font-semibold text-xl">Update Department</h1>}    
      {type === "delete" && <h1 className="font-semibold text-xl">Delete Department</h1>}    

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Department Name"
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

export default DepartmentForm;
