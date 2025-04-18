"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionEdit, ActionDelete } from "@/serverActions/actionGeneral";
import { SchemaCreateEditSysConstant } from "@/Domain/schemas/schemas";
import { protocol } from "@/config";
import { GetSysCategoryUrl, SysConstantUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getData, handleResponseError } from "@/functions";
import { GetSysCategoryInter } from "@/Domain/Utils-H/appControl/appInter";
import SelectField from "../SelectField";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";


type Inputs = z.infer<typeof SchemaCreateEditSysConstant>;

const SysConstantForm = ({
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
    resolver: zodResolver(SchemaCreateEditSysConstant),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0)
  const [sysCat, setSysCat] = useState<GetSysCategoryInter[] | any>()
  useEffect(() => {
    if (count == 0) {
      const call = async () => {
        const response = await getData(protocol + "api" + params.domain + GetSysCategoryUrl, { nopage: true, fieldList: ["id", "name"] }, params.domain)
        if (response && response.length) {
          if (type != "create" && data){ 
            setSysCat(response.filter((item: GetSysCategoryInter) => item.name != data.sys_category__name)) 
          } else { 
            setSysCat(response) 
          } 
          
        }
        setCount(1)

      }
      call()
    }
  }, [count, params, data, type])

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newData = {
      name: formVals["name"] ? formVals["name"].toUpperCase() : "",
      sys_category_id: formVals.sys_category_id
    }
    
    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newData, SchemaCreateEditSysConstant, protocol + "api" + params.domain + SysConstantUrl)
        const t = await handleResponseError(response, ["name", "sys_category_id"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/SysConstant?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newData, data.id, SchemaCreateEditSysConstant, protocol + "api" + params.domain + SysConstantUrl, params.domain)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/SysConstant?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + SysConstantUrl, data.id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/SysConstant?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
  });

  return (
    <>
      {type &&
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {type === "create" && <h1 className="font-semibold text-xl">Create System Value</h1>}
          {type === "update" && <h1 className="font-semibold text-xl">Update Value</h1>}
          {type === "delete" && <h1 className="font-semibold text-xl">Delete Value</h1>}

          <div className="flex flex-wrap gap-4 justify-between">
            <InputField
              label="Value Name"
              name="name"
              defaultValue={data?.name}
              register={register}
              error={errors?.name}
              readOnly={type == "delete"}
            />
            <SelectField
              label="Category"
              name="sys_category_id"
              defaultValue={data?.sys_category__id}
              defaultName={data?.sys_category__name}
              register={register}
              error={errors?.sys_category_id}
              data={sysCat}
              display={ {name: "name", value: "id"} }
            />
          </div>

          <MyButtonModal type={type} clicked={clicked} />

        </form>
      }
    </>
  );
};

export default SysConstantForm;
