"use client";
import { z } from "zod";
import { GrStatusGood } from "react-icons/gr";
import { FaArrowRight } from "react-icons/fa6";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { useFormState, useFormStatus } from "react-dom";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TranscriptPrint } from "@/serverActions/formActions";
import { useEffect, useState } from "react";
import { getData } from "@/functions";
import { protocol } from "@/config";
import { GetTranscriptApplicationUrl } from "@/Domain/Utils-H/feesControl/feesConfig";
import { GetTranscriptApplicationInter } from "@/Domain/Utils-H/feesControl/feesInter";
import Loader from "@/section-h/common/Loader";


const SchemaCreate = z.object({
  userprofile_id: z.coerce.number().int().gte(1),
})

type Inputs = z.infer<typeof SchemaCreate>;
const ConfirmTranscriptPrint = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom" | "update" | "delete";
  params?: any;
  data?: any;
  setOpen?: any;
  extra_data?: any;
}) => {

  const { register, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const [state, formAction] = useFormState(TranscriptPrint, null);
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [myTranscriptApplication, setMyTranscriptApplication] = useState<GetTranscriptApplicationInter>()

  useEffect(() => {
    if (count == 0 && data && data.id) {
      const getTA = async () => {
        var res = await getData(protocol + "api" + params.domain + GetTranscriptApplicationUrl, {
          nopage: true, userprofile__id: data.id,
          fieldList: ["id", "userprofile__id", "print_count"]
        }, params.domain)
        if (res && res.length == 1) {
          setMyTranscriptApplication(res[0]);
        }
        setCount(1); setLoading(false)
      }
      getTA();
    }
    if (count == 1 && state && state.data.id) {
      extra_data[1]()
    }
  }, [count, state, extra_data, data, params])

  const SubmitButton = () => {
    const status = useFormStatus();
    return <MyButtonModal type={"Check & Print"} clicked={status.pending} />
  }

  return (
    <>
      <div className="flex flex-col gap-2 items-center justify-center p-10 text-black text-lg">
        <div className="flex gap-4 items-center justify-center">
          <span className="text-start w-30">Ready</span>
          <span><GrStatusGood size={30} color="green" /></span>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <span className="text-start w-30">Approved</span>
          <span><GrStatusGood size={30} color="green" /></span>
        </div>

        {myTranscriptApplication ? <form className="flex flex-col gap-4 mb-2 mt-6" action={formAction}>
          <InputField
            label="TA"
            name="id"
            register={register}
            defaultValue={myTranscriptApplication?.id.toString()}
            type="number"
            className="hidden"
          />
          <InputField
            label="TA"
            name="print_count"
            register={register}
            defaultValue={myTranscriptApplication?.print_count.toString()}
            type="number"
            className="hidden"
          />
          <InputField
            label="Student"
            name="userprofile_id"
            register={register}
            defaultValue={data?.id.toString()}
            error={errors?.userprofile_id}
            type="number"
            className="hidden"
          />
          <InputField
            label="Domain"
            name="domain"
            register={register}
            defaultValue={params.domain}
            className="hidden"
          />
          <SubmitButton />
        </form>
        :
        <>
          {loading && <Loader />}
        </>
      }
      </div>
    </>
  );
};

export default ConfirmTranscriptPrint;
