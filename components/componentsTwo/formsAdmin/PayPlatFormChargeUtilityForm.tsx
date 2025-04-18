"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { GetSchoolFeesInter } from "@/Domain/Utils-H/feesControl/feesInter";
import SelectField from "../SelectField";
import InputField from "../InputField";
import { makePayment } from "@/serverActions/formActions";
import { ActionEdit } from "@/serverActions/actionGeneral";
import { SchemaCreateEditSchoolFees } from "@/Domain/schemas/schemas";
import { protocol } from "@/config";
import { SchoolFeesUrl } from "@/Domain/Utils-H/feesControl/feesConfig";

const SchemaCreate = z.object({
  amount: z.coerce.number().int().gte(10).lte(2500),
  operator: z.enum(["MTN", "ORANGE", "DIRECT"]),
  telephone: z.coerce.number().int().gte(610000000).lte(999999999),
})

type Inputs = z.infer<typeof SchemaCreate>;

const PayPlatFormChargeUtilityForm = ({
  type,
  data,
  params,
  setOpen,
  extra_data,
}: {
  type: "custom";
  extra_data: { onActivate: any, url: string, type: "single" | "multiple" };
  params: any;
  data?: GetSchoolFeesInter[];
  setOpen?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);

  console.log(data, 45)

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newData: { amount: number, service: string, telephone: number } = {
      amount: formVals.amount,
      service: formVals.operator,
      telephone: parseInt(formVals.telephone.toString()),
    }

    if (data && data.length == 1 && newData.amount && newData.service && newData.telephone) {
      const call = async () => {
        const response = await makePayment(newData);
        if (response && response.success) {
          if (response.pay.operation) {
            const response2 = await ActionEdit({...data, userprofile_id: data[0].userprofile_id, platform_paid: true}, data[0].id, SchemaCreateEditSchoolFees, protocol + "api" + params.domain + SchoolFeesUrl, params.domain)
            if (response2 && response2.id){
              router.push(`/${extra_data?.url}?customsuccess=Activated !!!`);
              setClicked(false)
            }
          }
          if (!response.pay.operation) {
            router.push(`/${extra_data?.url}?customerror=${response.pay.transaction} !!!`);
            setClicked(false)
          }
        }
        if (response && response.error) {
          router.push(`/${extra_data?.url}?customerror=${response.error} !!!`);
          setClicked(false)
        }
      }
      call()
    }

    if (0 && data && data.length > 1 && newData.amount && newData.service && newData.telephone) {
      const call = async () => {
        const response = await makePayment(newData);
        if (response && response.success) {
          if (response.pay.operation) {
            const response2 = await ActionEdit({...data, userprofile_id: data[0].userprofile_id, platform_paid: true}, data[0].id, SchemaCreateEditSchoolFees, protocol + "api" + params.domain + SchoolFeesUrl, params.domain)
            if (response2 && response2.id){
              router.push(`/${extra_data?.url}?customsuccess=Activated !!!`);
              setClicked(false)
            }
          }
          if (!response.pay.operation) {
            router.push(`/${extra_data?.url}?customerror=${response.pay.transaction} !!!`);
            setClicked(false)
          }
        }
        if (response && response.error) {
          router.push(`/${extra_data?.url}?customerror=${response.error} !!!`);
            setClicked(false)
          // if (response?.pay?.message) {
          //   router.push(`/${extra_data?.url}?customerror=${response.pay?.message} !!!`);
          //   setClicked(false)
          // } else  {
          //   router.push(`/${extra_data?.url}?customerror=${response.error} !!!`);
          //   setClicked(false)
          // }
        }
      }
      call()
    }
  })

  const SubmitButton = () => {
    return <MyButtonModal type={"custom"} title="ACTIVATE" clicked={clicked} className="bg-blue-300" />
  }

  return (
    <>
      {extra_data.type == "single" ?
        data ?
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            {type === "custom" && <h1 className="font-semibold text-xl">Activate Account</h1>}

            <div className="flex flex-col gap-4 justify-between mb-4">
              <SelectField
                label="MOBILE OPERATOR"
                name="operator"
                register={register}
                error={errors?.operator}
                data={["MTN", "ORANGE"]}
              />

              <InputField
                label="Amount"
                name="amount"
                defaultValue={data[0].platform_charges.toString()}
                register={register}
                error={errors?.amount}
                readOnly={true}
              />
              <InputField
                label="Telephone"
                name="telephone"
                register={register}
                error={errors?.telephone}
                type="number"
              />
              <InputField
                label="ORIGIN"
                name="origin"
                register={register}
                defaultValue={"admin"}
                readOnly={true}
                className="hidden"
              />
              <InputField
                label="ID"
                name="id"
                register={register}
                defaultValue={data[0].id.toString()}
                readOnly={true}
                className="hidden"
              />
            </div>

            <SubmitButton />

          </form>
          :
          <div className="flex flex-col gap-4 h-full items-center justify-center w-full">
            <div>No School Fee Information</div>
            {/* <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/SysConstant`} className="border px-6 py-2 rounded">Goto System Values</Link> */}
          </div>
        :
        <></>
        // <div className="bg-white dark:bg-black flex h-full items-center justify-center py-10">
        //   <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-16 rounded-full w-16"></div>
        // </div>
      }

      {extra_data.url == "multiple" ?
        data ?
          <form className="flex flex-col gap-4" action={extra_data.onActivate}>
            {type === "custom" && <h1 className="font-semibold text-xl">Activate Account</h1>}

            <div className="flex flex-col gap-4 justify-between">
              <SelectField
                label="MOBILE OPERATOR"
                name="operator"
                // defaultValue={data?.operator}
                register={register}
                error={errors?.operator}
                data={["MTN MONEY", "ORANGE MONEY"]}
              />


              <InputField
                label="Amount"
                name="amount"
                defaultValue={data[0].platform_charges.toString()}
                register={register}
                error={errors?.amount}
                readOnly={true}
              />
              <InputField
                label="Telephone"
                name="telephone"
                register={register}
                error={errors?.telephone}
              />

              <InputField
                label="URL"
                name="url"
                register={register}
                defaultValue={extra_data.url}
                readOnly={true}
                className="hidden"
              />
              <InputField
                label="ORIGIN"
                name="origin"
                register={register}
                defaultValue={"admin"}
                readOnly={true}
                className="hidden"
              />

            </div>

            {/* <MyButtonModal type={"ACTIVATE"} clicked={clicked} /> */}

          </form>
          :
          <div className="flex flex-col gap-4 h-full items-center justify-center w-full">
            <div>Soon ...</div>
          </div>
        :
        <></>
      }
    </>
  );
};

export default PayPlatFormChargeUtilityForm;
