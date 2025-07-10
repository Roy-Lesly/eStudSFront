"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectField from "../SelectField";
import { ActionCreate, ActionEdit } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { decodeUrlID, getData } from "@/functions";
import { useEffect, useState } from "react";
import { GetSysConstantUrl } from "@/Domain/Utils-H/appControl/appConfig";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import Link from "next/link";
import { GetSysConstantInter } from "@/Domain/Utils-H/appControl/appInter";
import { SchemaCreateEditTransactions } from "@/Domain/schemas/schemas";
import { TransactionUrl } from "@/Domain/Utils-H/feesControl/feesConfig";
import InputField from "../InputField";
import { EdgeSchoolFees } from "@/Domain/schemas/interfaceGraphql";
import getApolloClient from "@/utils/graphql/GetAppolloClient";



const SchemaCreate = z.object({
  reason: z.string().trim().min(2, { message: "Must Select A Reason" }),
  amount: z.coerce.number().int().gte(1000).lte(1000000),
  payment_method: z.enum(["DIRECT", "BANK", "MTN MONEY", "ORANGE MONEY"]),
  ref: z.string().optional(),
  telephone: z.string().optional(),
})

type Inputs = z.infer<typeof SchemaCreate>;

const PayFeesForm = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "create" | "update" | "delete" ;
  params?: any;
  data: EdgeSchoolFees;
  setOpen?: any;
  extra_data?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter();
  const client = getApolloClient(params.domain);
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState<boolean>(false);
  const [apiAccounts, setApiAccounts] = useState<GetSysConstantInter[]>();

  useEffect(() => {
    if (count == 0) {
      var getYears = async () => {
        var res = await getData(protocol + "api" + params.domain + GetSysConstantUrl, { sys_category__name: "acc", nopage: true }, params.domain)
        if (res) { setApiAccounts(res) }
        setCount(1)
      }
      getYears()
      client.resetStore()
    }
  }, [count, params, data])

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newData = {
      reason: formVals.reason?.toString().toUpperCase(),
      account: formVals.reason?.toString().toUpperCase(),
      amount: formVals.amount,
      payment_method: formVals.payment_method,
      operation_type: "income",
      schoolfees_id: decodeUrlID(data.node.id.toString()),
      ref: formVals.ref,
    }
    if (type === "create" && data) {
      const call = async () => {
        const response = await ActionCreate(newData, SchemaCreateEditTransactions, protocol + "api" + params.domain + TransactionUrl)
        if (response && response.id) {
          router.push(`${extra_data[0]}?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        console.log(response, 84)
        // client.resetStore()
        setClicked(false)
      }
      call()
    }
    if (type === "update" && data) {
      const call = async () => {
        const response = await ActionEdit(newData, data.node.id, SchemaCreateEditTransactions, protocol + "api" + params.domain + TransactionUrl, params.domain)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Fees?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <>
      {apiAccounts ?
        apiAccounts.length ?
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            {type === "create" && <h1 className="font-semibold text-xl">Create Transaction</h1>}
            {type === "update" && <h1 className="font-semibold text-xl">Update Transaction</h1>}
            {type === "delete" && <h1 className="font-semibold text-xl">Delete Transaction</h1>}

            <div className="flex flex-col gap-4 justify-between">
              <div className="flex flex-row gap-2">
              <SelectField
                label="PURPOSE"
                name="reason"
                register={register}
                error={errors?.reason}
                display={{ name: "name", value: "name" }}
                data={apiAccounts}
              />
              {/* <div className="flex items-center justify-center w-12">
              <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/SysConstant`} className="flex font-bold text-4xl">+</Link>
              </div> */}
              </div>

              <SelectField
                label="PAYMENT METHOD"
                name="payment_method"
                defaultValue={"DIRECT"}
                register={register}
                error={errors?.payment_method}
                data={["DIRECT", "BANK", "MTN MONEY", "ORANGE MONEY"]}
              />

              <InputField
                label="Amount"
                name="amount"
                defaultValue={"100"}
                register={register}
                error={errors?.amount}
                type="number"
              />

            </div>

            <MyButtonModal type={type} clicked={clicked} />

          </form>
          :
          <div className="flex flex-col gap-4 h-full items-center justify-center w-full">
            <div>No Accounts</div>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/SysConstant`} className="border px-6 py-2 rounded">Goto System Values</Link>
          </div>
        :
        <div className="bg-white dark:bg-black flex h-full items-center justify-center py-10">
          <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-16 rounded-full w-16"></div>
        </div>

      }
    </>
  );
};

export default PayFeesForm;
