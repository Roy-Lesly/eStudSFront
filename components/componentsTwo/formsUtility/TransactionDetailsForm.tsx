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
import { SchemaCreateEditAccount, SchemaCreateEditSysConstant } from "@/Domain/schemas/schemas";
import { useState } from "react";
import { SysCategoryInter } from "@/Domain/Utils-H/appControl/appInter";
import { EdgeTransactions } from "@/Domain/schemas/interfaceGraphql";

type Inputs = z.infer<typeof SchemaCreateEditAccount>;

const TransactionDetailsForm = ({
  type,
  data,
  setOpen,
  params,
  extra_data,
}: {
  type: "custom";
  setOpen: any;
  extra_data: {
    apiYears: string[],
    form: "update_transaction"
    sysCat?: SysCategoryInter
    year?: string[]
  };
  data?: EdgeTransactions;
  params?: any;
}) => {

  const router = useRouter();
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState<boolean>(false);

  console.log(data)

  return (
    <>

      <form className="flex flex-col">
          <div className="gap-2 mb-10">
            <h1 className="font-semibold text-xl">Transaction Details</h1>

            <div className="flex flex-wrap gap-4 justify-between">
              <InputField
                label="Account Name"
                name="name"
                defaultValue={data?.node.account}
                register={()=>{}}
                // error={}
              />
            </div>
            <div className="flex flex-wrap gap-4 justify-between">
              <InputField
                label="Amount"
                name="name"
                defaultValue={data?.node.amount.toString() + " F"}
                register={()=>{}}
              />
            </div>
            <div className="flex flex-wrap gap-4 justify-between">
              <InputField
                label="Date"
                name="name"
                defaultValue={data?.node.createdAt}
                register={()=>{}}
              />
            </div>
          </div>
      </form>

    </>
  );
};

export default TransactionDetailsForm;

