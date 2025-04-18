"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { GetSchoolFeesInter } from "@/Domain/Utils-H/feesControl/feesInter";
import { useFormState, useFormStatus } from "react-dom";
import { TranscriptApply } from "@/serverActions/formActions";
import { getData } from "@/functions";
import { protocol } from "@/config";
import { GetResultUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetResultInter } from "@/Domain/Utils-H/appControl/appInter";
import InputField from "../InputField";
import { GrClose, GrStatusGood } from "react-icons/gr";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

const SchemaCreate = z.object({
  userprofile_id: z.coerce.number().int().gte(1),
})

type Inputs = z.infer<typeof SchemaCreate>;

const ConfirmTranscriptApply = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom";
  params?: any;
  data?: GetSchoolFeesInter;
  setOpen?: any;
  extra_data?: any;
}) => {
  const { register, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const [count, setCount] = useState(0);
  const [state, formAction] = useFormState(TranscriptApply, null);
  const [results, setResults] = useState<GetResultInter[] | undefined>();
  const [hasWrittenAllResults, setHasWrittenAllResults] = useState<boolean | undefined>();

  useEffect(() => {
    if (count == 0) {
      const getCourses = async () => {
        const res = await getData(protocol + "api" + params.domain + GetResultUrl, { nopage: true, student__id: data?.userprofile_id }, params.domain)
        if (res && res.length) { setResults(res) }
        setCount(1)
      }
      getCourses()
    }
    if (count == 1 && results && results.length) {
      var check = true
      for (let index = 0; index < results.length; index++) {
        const res = results[index];
        if (!res.exam) { check = false; setHasWrittenAllResults(false); setCount(2); break; return }
      }
      if (check == true) { setHasWrittenAllResults(true); setCount(2); }
    }
  }, [count, params, data, results])

  const SubmitButton = () => {
    const status = useFormStatus();
    return <MyButtonModal type={"Apply"} clicked={status.pending} />
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold my-4 text-center text-lg tracking-widest">Transcript Application</div>

      {state && state.data.id ? <div className="flex flex-col gap-6 items-center justify-center p-10 text-lg">
        <div className="flex gap-4 items-center justify-between">
            <span>Approved</span>
            <span><GrStatusGood size={50} color="green" /></span>
          </div>
        <Link href={`${extra_data[0]}`} className="border border-teal-600 flex gap-2 items-center justify-center mt-3 px-6 py-2 rounded"><FaArrowLeft size={20} /></Link>
      </div>

        :

        <>
          <div className="flex font-semibold gap-4 justify-between my-2 text-lg tracking-widest">
            <span className="flex items-center">Written All Courses</span>
            <span className="flex items-center">{hasWrittenAllResults ? <GrStatusGood size={30} color="green" /> : <GrClose color="red" />}</span>
          </div>

          {/* {!hasWrittenAllResults ?  */}
          {hasWrittenAllResults ? 
          <form className="flex flex-col gap-4 my-2" action={formAction}>
            <InputField
              label="Student"
              name="userprofile_id"
              register={register}
              defaultValue={data?.userprofile_id.toString()}
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
            <></>}
        </>}
    </div>
  );
};

export default ConfirmTranscriptApply;
