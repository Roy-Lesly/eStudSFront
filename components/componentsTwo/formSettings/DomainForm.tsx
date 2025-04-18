"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionEdit, ActionDelete } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { SchemaCreateEditDomain } from "@/Domain/schemas/schemas";
import { DomainUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { handleResponseError } from "@/functions";


type Inputs = z.infer<typeof SchemaCreateEditDomain>;

interface PropsType {
  type: "create" | "update" | "delete" ;
  params?: any;
  data?: any;
  setOpen?: any;
}
const DomainForm = (props: PropsType) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreateEditDomain),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newVals = {
      domain_name: formVals.domain_name.toUpperCase(),
    }

    if (props.type === "create") {
      const call = async () => {
        const response = await ActionCreate(newVals, SchemaCreateEditDomain, protocol + "api" + props.params.domain + DomainUrl)
        const t = await handleResponseError(response, ["domain_name"]);
        if (t == "" && response && response.id) {
          router.push(`/${props.params.domain}/Section-H/pageAdministration/${props.params.school_id}/pageSettings/pageDomains?created="SUCCESSFULLY (${response.id}) !!!`);
          props.setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (props.type === "update") {
      const call = async () => {
        const response = await ActionEdit(newVals, props.data.id, SchemaCreateEditDomain, protocol + "api" + props.params.domain + DomainUrl, props.params.domain)
        if (response && response.id) {
          router.push(`/${props.params.domain}/Section-H/pageAdministration/${props.params.school_id}/pageSettings/pageDomains?updated="SUCCESSFULLY (${response.id}) !!!`);
          props.setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (props.type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + props.params.domain + DomainUrl, props.data.id)
        if (response && response.success) {
          router.push(`/${props.params.domain}/Section-H/pageAdministration/${props.params.school_id}/pageSettings/pageDomains?deleted="DELETED (${props.data.id}) !!!`);
          props.setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
  });

  return (

    <form className="bg-slate-300 flex flex-col gap-4 p-2 rounded" onSubmit={onSubmit}>
      {props.type === "create" && <h1 className="font-semibold text-xl">Create Domain</h1>}
      {props.type === "update" && <h1 className="font-semibold text-xl">Update Value</h1>}

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Domain Name"
          name="domain_name"
          defaultValue={props.data?.domain_name}
          register={register}
          error={errors?.domain_name}
        />
      </div>

      <MyButtonModal type={props.type} clicked={clicked} />

    </form>
  );
};

export default DomainForm;
