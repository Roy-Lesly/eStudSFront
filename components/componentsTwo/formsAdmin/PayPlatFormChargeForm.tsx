"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import SelectField from "../SelectField";
import InputField from "../InputField";
import { makePayment } from "@/serverActions/formActions";
import { ActionEdit } from "@/serverActions/actionGeneral";
import { SchemaCreateEditSchoolFees } from "@/Domain/schemas/schemas";
import { protocol } from "@/config";
import { SchoolFeesUrl } from "@/Domain/Utils-H/feesControl/feesConfig";
import { EdgeSchoolFees } from "@/Domain/schemas/interfaceGraphql";
import NotificationError from "@/section-h/common/NotificationError";
import { useTranslation } from "react-i18next";

const SchemaCreate = z.object({
  amount: z.coerce.number().int().gte(10).lte(2500),
  operator: z.enum(["MTN", "ORANGE", "DIRECT"]),
  telephone: z.coerce.number().int().gte(610000000).lte(999999999),
})

type Inputs = z.infer<typeof SchemaCreate>;

const PayPlatFormChargeForm = ({
  type,
  data,
  params,
  setOpen,
  extra_data,
}: {
  type: "custom";
  extra_data: { url: string, platformCharges: number, type: "single" | "multiple" };
  params: any;
  data: EdgeSchoolFees;
  setOpen?: any;
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    console.log(data, 50);
    return
    const newData: { amount: number, service: string, telephone: number } = {
      amount: formVals.amount,
      service: formVals.operator,
      telephone: parseInt(formVals.telephone.toString()),
    }

    if (data && data.node.id && newData.amount && newData.service && newData.telephone) {
      const call = async () => {
        const response = await makePayment(newData);
        if (response && response.success) {
          if (response.pay.operation) {
            const response2 = await ActionEdit({...data, userprofile_id: data.node.userprofile.id, platform_paid: true}, data.node.id, SchemaCreateEditSchoolFees, protocol + "api" + params.domain + SchoolFeesUrl, params.domain)
            if (response2 && response2.id){
              router.push(`/${extra_data?.url}?customsuccess=Activated !!!`);
              setClicked(false)
            }
          }
          if (!response.pay.operation) {
            router.push(`/${extra_data?.url}?customerror=${response.pay.transaction} !!!`);
            <NotificationError errorMessage="Transaction Failed" />
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
  })

  const CreateTransaction = () => {

  }

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
                defaultValue={data?.node.userprofile.specialty.school.schoolIdentification.platformCharges.toString()}
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
                defaultValue={data.node.id.toString()}
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
        <div className="bg-white dark:bg-black flex h-full items-center justify-center py-10">
          <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-16 rounded-full w-16"></div>
        </div>
      }

      {extra_data.url == "multiple" ?
        data ?
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
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
                defaultValue={data.node.userprofile.specialty.school.schoolIdentification.platformCharges?.toString()}
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
                defaultValue={extra_data?.url}
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

          </form>
          :
          <div className="flex flex-col gap-4 h-full items-center justify-center w-full">
            <div>{t("Soon")} ...</div>
          </div>
        :
        <></>
      }
    </>
  );
};

export default PayPlatFormChargeForm;
