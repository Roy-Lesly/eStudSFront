"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActionCreate } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { AccountUrl } from "@/Domain/Utils-H/feesControl/feesConfig";
import { SchemaCreateEditAccount, SchemaCreateEditSysConstant } from "@/Domain/schemas/schemas";
import { handleResponseError } from "@/functions";
import { ReactNode, useEffect, useState } from "react";
import { SysConstantUrl } from "@/Domain/Utils-H/appControl/appConfig";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { GetAccountInter } from "@/Domain/Utils-H/feesControl/feesInter";
import { AccountTypesList, ConstAccountLists } from "@/constants";
import { SysCategoryInter } from "@/Domain/Utils-H/appControl/appInter";
import InputField from "@/componentsTwo/InputField";

type Inputs = z.infer<typeof SchemaCreateEditAccount>;

const AccountCreateForm = ({
  type,
  data,
  setOpen,
  params,
  extra_data,
}: {
  type: "create" | "update";
  setOpen: any;
  extra_data: {
    apiYears: string[],
    sysCat?: SysCategoryInter
    year?: string[]
  };
  data?: GetAccountInter;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreateEditAccount),
  });

  const router = useRouter();
  const [progressLevel, setProgressLevel] = useState(0);
  const [clicked, setClicked] = useState<boolean>(false);

  const onSubmitCreateAccount = async () => {
    setClicked(true);
    if (type === "create") {
      const call = async () => {
        for (let index = 0; index < AccountTypesList.length; index++) {
          const acc = AccountTypesList[index];
          for (let index2 = 0; index2 < extra_data.apiYears.length; index2++) {
            const year = extra_data.apiYears[index2];
            const response = await ActionCreate({ name: acc, number: acc.slice(0, 3) + "-" + year, year: year, balance: 0 }, SchemaCreateEditAccount, protocol + "api" + params.domain + AccountUrl)
            const t = await handleResponseError(response, ["name"]);
            if (t == "" && response && response.id) {
              setProgressLevel(index != AccountTypesList.length - 1 ? progressLevel + 17 : 99)
            }

          }
        }
        setClicked(false)
      }
      if (progressLevel > 95) {
        router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account?created="CREATED SUCCESSFULLY !!!`);
        setOpen(false)
      }
      call()

    }
  };
  console.log(progressLevel)

  return (
    <>
      <form className="flex flex-col" onSubmit={onSubmitCreateAccount}>

        {type === "create" ?
          <div className="mb-10">
            <h1 className="font-semibold mb-10 text-xl">Create All Accounts</h1>

            <div className="flex flex-col gap-10 w-full">
              <ButtonHere title="Create" clicked={clicked} type="create_account_constants" functionCall={onSubmitCreateAccount} />
            </div>
          </div>
          :
          null
        }
      </form>

    </>
  );
};

export default AccountCreateForm;


const ButtonHere = ({ clicked, title, type, functionCall, icon }: { clicked: boolean, title: string, functionCall: any, type: string, icon?: ReactNode }) => {
  return <>
    {clicked ?
      <div className={`p-2 cursor-pointer rounded-md text-white flex items-center justify-center`}>
        <span className={`${type == "update_account_constants" ? "border-green-500" : "border-bluedash"} animate-spin border-6  border-t-transparent flex h-[34px] rounded-full w-[34px]`}>.</span>
      </div>

      :
      <div onClick={() => functionCall()} className={`${type == "update_account_constants" ? "bg-green-600" : type == "update" ? "bg-blue-400" : "bg-blue-700"} cursor-pointer font-medium px-6 py-2 flex items-center gap-2 rounded-md text-white justify-center`}>
        {title}
        {icon}
      </div>
    }
  </>
}
