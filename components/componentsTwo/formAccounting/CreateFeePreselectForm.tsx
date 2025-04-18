"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { useState } from "react";
import SelectField from "../SelectField";
import { GetCustomUserInter } from "@/Domain/Utils-H/userControl/userInter";


const ZodValidator = z.object({
  value: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
  domain_id: z.coerce.number().min(1, { message: "Class Must Contain 1 Characters Minimum" }),
})
type Inputs = z.infer<typeof ZodValidator>;

const CreateFeePreselectForm = ({
  apiDomains,
  setOpen,
  params,
}: {
  apiDomains: any[],
  setOpen?: any;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(ZodValidator),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);

    const value = formVals.value
    const domain = formVals.domain_id

    const call = async () => {
      if (domain && value) {
        router.push(`/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageFees?value=${value}&domain=${domain}`);
        setOpen(false)
      }
      setClicked(false)
    }
    call()
  });

  return (
    <form className="flex flex-col gap-1 md:gap-4" onSubmit={onSubmit}>
      <h1 className="font-semibold text-xl">Search Student</h1>

      <div className="flex flex-wrap gap-4 justify-between">
        <SelectField
          label="Select Domain"
          name="domain_id"
          register={register}
          error={errors?.domain_id}
          data={apiDomains}
          display={{ "name": "domain_name", value: "id" }}
        />
      </div>

      <div className="flex flex-row gap-2">
        <InputField
          label="Full Name"
          name="value"
          register={register}
          error={errors?.value}
        />
      </div>

      <div className="flex items-center justify-center md:mt-6 mt-4 w-full">
        <MyButtonModal type={"Search"} clicked={clicked} />
      </div>


    </form>
  );
};

export default CreateFeePreselectForm;

const SearchLecturer = ({ apiLecturer, data, register, name }: any) => {
  const [newData, setNewData] = useState<GetCustomUserInter[]>(apiLecturer);
  const onSearch = (text: string) => {
    if (text.length > 2) {
      const fil = apiLecturer.filter((item: GetCustomUserInter) => item.full_name.toLowerCase().includes(text.toLowerCase()))
      setNewData(fil)
    }
    else { setNewData(apiLecturer) }
  }

  return (
    <div className="col-span-2 flex-col items-center justify-center md:flex mx-0 px-0 w-full">
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search Lecturer"
        className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-2 py-1 rounded-lg text-black transition w-full"
      />
      <select
        {...register(name)}
        name="assigned_to_id" defaultValue={data?.assigned_to_id} className='border-2 px-1 py-1 rounded w-full'>
        <option value={0}>------------------</option>
        {newData && newData.map((item: GetCustomUserInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
          {item.full_name.slice(0, 20)}
        </option>)
        )}
      </select>
    </div>
  )
}