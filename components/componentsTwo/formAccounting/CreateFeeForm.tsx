"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { useEffect, useState } from "react";
import SelectField from "../SelectField";
import { SchemaCreateEditTransactions } from "@/Domain/schemas/schemas";
import { ActionCreate, ActionEdit } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { TransactionUrl } from "@/Domain/Utils-H/feesControl/feesConfig";
import { GetTransactionsInter } from "@/Domain/Utils-H/feesControl/feesInter";
import { getData, handleResponseError } from "@/functions";
import { GetSysConstantUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetSysConstantInter } from "@/Domain/Utils-H/appControl/appInter";


const Schema = z.object({
  payment_method: z.string().trim().min(3, { message: "Must Select Payment Method" }),
  reason: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
  amount: z.coerce.number(),
  ref: z.string().trim().optional(),
  telephone: z.string().optional(),
})

type Inputs = z.infer<typeof Schema>;

const CreateFeeForm = ({
  data,
  setOpen,
  params,
  type
}: {
  type: "create" | "update" | "delete";
  data: GetTransactionsInter,
  setOpen?: any;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(Schema),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0)
  const [paymentData, setPaymentData] = useState<GetSysConstantInter[] | any>()
  const [reasonData, setReasonData] = useState<GetSysConstantInter[] | any>()


  useEffect(() => {
    if (count == 0) {
      const call = async () => {
        const responsePayment = await getData(protocol + "api" + params.domain + GetSysConstantUrl, { nopage: true, sys_category__name: "payment", fieldList: ["name"] }, params.domain)
        const responseReason = await getData(protocol + "api" + params.domain + GetSysConstantUrl, { nopage: true, sys_category__name: "account", fieldList: ["name"] }, params.domain)
        if (responsePayment && responsePayment.length) { setPaymentData(responsePayment) }
        if (responseReason && responseReason.length) { setReasonData(responseReason) }
        setCount(1)

      }
      call()
    }
  }, [count, params, data])
  console.log(data)

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);

    const newVals = {
      schoolfees_id: data.id,
      amount: formVals.amount,
      payment_method: formVals.payment_method,
      reason: formVals.reason,
      operation_type: "income",
    }


    if (type === "update") {
      if (newVals) {
        const call = async () => {
          const response = await ActionCreate(newVals, SchemaCreateEditTransactions, protocol + "api" + params.domain + TransactionUrl)
          const t = await handleResponseError(response, ["schoolfees_id", "amount", "payment_method", "reason", "operation_type"]);
          if (t == "" && response && response.id) {
            router.push(`/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageFees?created="SUCCESSFULLY (${response.id}) !!!`);
            setOpen(false)
          }
          setClicked(false)
        }
        call()
      }
    }

    if (type === "update") {
      if (newVals) {
        const call = async () => {
          const response = await ActionEdit(newVals, data.id, SchemaCreateEditTransactions, protocol + "api" + params.domain + TransactionUrl, params.domain)
          if (response && response.id) {
            router.push(`/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageFees?created="SUCCESSFULLY (${response.id}) !!!`);
            setOpen(false)
          }
          setClicked(false)
        }
        call()
      }
    }

  });

  return (
    <form className="flex flex-col gap-1 md:gap-4" onSubmit={onSubmit}>
      {type === "create" && <h1 className="font-semibold text-xl">New Payment</h1>}
      {type === "update" && <h1 className="font-semibold text-xl">Detail Payment</h1>}

      <div className="flex flex-row gap-2">
        <InputField
          label="Amount"
          name="amount"
          defaultValue={data?.amount.toString()}
          register={register}
          error={errors?.amount}
        />
      </div>
      <div className="flex flex-row gap-2">
        <SelectField
          label="Payment Method"
          name="payment_method"
          defaultValue={data?.payment_method}
          defaultName={data?.payment_method}
          register={register}
          error={errors?.payment_method}
          data={paymentData}
          display={{ "name": "name", value: "name" }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <SelectField
          label="Reason"
          name="reason"
          defaultValue={data?.reason}
          defaultName={data?.reason}
          register={register}
          error={errors?.reason}
          data={reasonData}
          display={{ "name": "name", value: "name" }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <InputField
          label="Telephone"
          name="telephone"
          register={register}
          error={errors?.telephone}
          type="number"
        />
      </div>
      <div className="flex flex-row gap-2">
        <InputField
          label="Reference ID"
          name="ref"
          register={register}
          error={errors?.ref}
        />
      </div>

      <div className="flex items-center justify-center md:mt-6 mt-4 w-full">
        <MyButtonModal type={type} clicked={clicked} />
      </div>


    </form>
  );
};

export default CreateFeeForm;
