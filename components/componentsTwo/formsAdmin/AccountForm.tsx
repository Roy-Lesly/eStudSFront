"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { ActionCreate, ActionEdit, ActionDelete } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { AccountUrl } from "@/Domain/Utils-H/feesControl/feesConfig";
import { SchemaCreateEditAccount } from "@/Domain/schemas/schemas";
import { getData, handleResponseError } from "@/functions";
import { useEffect, useState } from "react";
import { AcademicYearUrl } from "@/Domain/Utils-H/appControl/appConfig";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";

type Inputs = z.infer<typeof SchemaCreateEditAccount>;

const AccountForm = ({
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
    resolver: zodResolver(SchemaCreateEditAccount),
  });

  const router = useRouter();
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState<boolean>(false);
  const [apiYears, setApiYears] = useState<string[]>();

  useEffect(() => {
    if (count == 0) {
      var getYears = async () => {
        var res = await getData(protocol + "api" + params.domain + AcademicYearUrl, {}, params.domain)
        if (res && res.count) { 
          if (data && data.year){setApiYears(res.results.filter((item: string) => item != data.year))}
          else { setApiYears(res.results)}
        };
        setCount(1)
      }
      getYears()
    }
  }, [count, params, data])

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newData = {
      name: formVals.name.toUpperCase(),
      number: formVals.number,
      year: formVals.year,
      balance: formVals.balance,
    }
    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newData, SchemaCreateEditAccount, protocol + "api" + params.domain + AccountUrl)
        const t = await handleResponseError(response, ["name", "number", "year", "balance"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/Account?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newData, data.id, SchemaCreateEditAccount, protocol + "api" + params.domain + AccountUrl, params.domain)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/Account?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      return
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + AccountUrl, data.id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/Account?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {type === "create" && <h1 className="font-semibold text-xl">Create Account</h1>}
      {type === "update" && <h1 className="font-semibold text-xl">Update Account</h1>}
      {type === "delete" && <h1 className="font-semibold text-xl">Delete Account</h1>}

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Account Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Account Number"
          name="number"
          defaultValue={data?.number}
          register={register}
          error={errors?.number}
        />
        <SelectField
          label="Account Year"
          name="year"
          defaultValue={data?.year}
          register={register}
          error={errors?.year}
          data={apiYears}
        />
        <InputField
          label="Account Balance"
          name="balance"
          defaultValue={data?.balance}
          register={register}
          error={errors?.balance}
          readOnly={type != "create" ? true : false}
        />
      </div>

      <MyButtonModal type={type} clicked={clicked} />

    </form>
  );
};

export default AccountForm;
