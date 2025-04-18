import { AccountTypesList } from "@/constants";
import { GetSysConstantInter } from "@/Domain/Utils-H/appControl/appInter";
import { GrClose, GrStatusGood } from "react-icons/gr";
import FormModal from "../FormModal";
import { FaArrowRight } from "react-icons/fa6";



const ListAccountsUpdatePage = async ({ params, apiSysCategory, apiSysConstant, apiAccount, apiYears }: { params: any, apiSysCategory: any, apiSysConstant: any, apiAccount: any, apiYears: any }) => {

  console.log(params, 1)
  console.log(apiSysCategory, 2)
  console.log(apiSysConstant, 3)
  console.log(apiAccount, 4)
  console.log(apiYears, 5)
  return (
    <div className="flex flex-col gap-10 h-full items-center justify-center">

      <h1 className="font-bold my-4 text-center text-xl tracking-widest">ACCOUNTS SETTINGS</h1>

      <div className="bg-white flex flex-col gap-10 h-full md:w-[350px] mx-4 my-4 p-4 rounded w-72">


        <div className="flex w-full">
          <div className="w-[75%]">Presets (Category)</div>
          <div className="flex items-center justify-center w-[25%]">{apiSysCategory.length ? <GrStatusGood size={26} color="green" /> : "Bad"}</div>
        </div>


        <div className="flex flex-col gap-2">
          {AccountTypesList.map((item: string) => <div key={item} className="flex w-full">
            <div className="w-[75%]">{item}</div>
            <div className="flex items-center justify-center w-[25%]">{apiSysConstant.filter((con: GetSysConstantInter) => con.name == item).length ? <GrStatusGood size={26} color="green" /> : "Bad"}</div>
          </div>)}
        </div>


        <div className="flex w-full">
          <div className="w-[75%]">Accounts</div>
          <div className="flex items-center justify-center w-[25%]">{apiAccount.length >= AccountTypesList.length ?
            <span className="flex flex-row gap-2">
              <GrStatusGood size={24} color="green" />
              <button className="px-2 rounded">Update</button>
            </span>
            :
            <span className="flex flex-row gap-2">
              <GrClose size={24} color="red" />
              <button className="flex h-7 items-center justify-center rounded-full w-10">
                <FormModal table="accounts_create" type="create" params={params} icon={<FaArrowRight />} extra_data={ {apiYears: apiYears} } />
              </button>
            </span>
          }
          </div>
        </div>


      </div>
    </div>
  );
};

export default ListAccountsUpdatePage;
