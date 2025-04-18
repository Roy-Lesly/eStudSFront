"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { SchemaCreateEditAccount, SchemaTranscriptApplicationEditApprove, SchemaTranscriptApplicationEditPrint } from "@/Domain/schemas/schemas";
import { getData } from "@/functions";
import { useEffect, useState } from "react";
import { AcademicYearUrl } from "@/Domain/Utils-H/appControl/appConfig";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { useFormState, useFormStatus } from "react-dom";
import { TranscriptApprove } from "@/serverActions/formActions";
import { GrStatusGood } from "react-icons/gr";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

type Inputs = z.infer<typeof SchemaCreateEditAccount>;

const ConfirmTranscriptApprove = ({
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
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaTranscriptApplicationEditApprove),
  });

  const router = useRouter();
  const [count, setCount] = useState(0);
  const [state, formAction] = useFormState(TranscriptApprove, null);
  const [clicked, setClicked] = useState<boolean>(false);
  const [apiYears, setApiYears] = useState<string[]>();

  useEffect(() => {
    if (count == 0) {
      var getYears = async () => {
        var res = await getData(protocol + "api" + params.domain + AcademicYearUrl, {}, params.domain)
        if (res && res.count) {
          if (data && data.year) { setApiYears(res.results.filter((item: string) => item != data.year)) }
          else { setApiYears(res.results) }
        };
        setCount(1)
      }
      getYears()
    }
  }, [count, params, data])

  console.log(state, 58)
  const SubmitButton = () => {
    const status = useFormStatus();
    return <MyButtonModal type={"Approve"} clicked={status.pending} />
  }

  return (
    <>
      {state && state.data ?

        <div className="flex flex-col gap-6 items-center justify-center p-10 text-lg">
          <div className="flex gap-4 items-center justify-between">
            <span>Approved</span>
            <span><GrStatusGood size={50} color="green" /></span>
          </div>
          <Link href={`${extra_data[0]}/${state.data.userprofile.id}`} className="border border-teal-600 flex gap-2 items-center justify-center mt-3 px-6 py-2 rounded">Print<FaArrowRight size={20} /></Link>
        </div>
        :
        <form className="flex flex-col gap-4" action={formAction}>
          {type === "custom" && <h1 className="font-semibold text-xl">Approve Request</h1>}

          <h1 className="font-semibold text-center text-lg">Are You Sure To Confirm The request ?</h1>

          <div className="flex flex-wrap gap-4 justify-between">
            <InputField
              label="Domain"
              name="domain"
              defaultValue={params.domain}
              register={register}
              className="hidden"
            />
            <InputField
              label="Trancript Application ID"
              name="id"
              defaultValue={data?.id}
              register={register}
              className="hidden"
            />
            <InputField
              label="Profile ID"
              name="userprofile_id"
              defaultValue={data?.userprofile__id}
              register={register}
              className="hidden"
            />
          </div>

          <div className="flex gap-6 items-center justify-center">
            <button className="border border-teal-500 px-4 py-1 rounded">Cancel</button>
            <SubmitButton />
          </div>

        </form>
      }
    </>
  );
};

export default ConfirmTranscriptApprove;
